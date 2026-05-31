import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";
import { buildOrderItems } from "../utils/orderPricing.js";

dotenv.config();

let stripeClient = null;
let razorpayClient = null;

const getStripeClient = () => {
    if (stripeClient) {
        return stripeClient;
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        return null;
    }

    stripeClient = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
    return stripeClient;
};

const getRazorpayClient = () => {
    if (razorpayClient) {
        return razorpayClient;
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
        return null;
    }

    razorpayClient = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret
    });

    return razorpayClient;
};

const getPaymentProvider = () => {
    return (process.env.PAYMENT_PROVIDER || "razorpay").toLowerCase();
};

export const createCheckoutSession = async (req, res) => {
    try {
        if (!process.env.CLIENT_URL) {
            return res.status(500).json({ success: false, message: "CLIENT_URL is not configured" });
        }

        const { items } = req.body;
        const { orderItems, totalAmount, productMap, error } = await buildOrderItems(items);

        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const provider = getPaymentProvider();

        if (provider === "stripe") {
            const stripe = getStripeClient();
            if (!stripe) {
                return res.status(500).json({ success: false, message: "Stripe is not configured" });
            }

            const order = new Order({
                buyer: req.userId,
                items: orderItems,
                totalAmount,
                status: "Pending",
                paymentStatus: "Pending",
                paymentProvider: "stripe",
                currency: "INR"
            });

            const lineItems = orderItems.map((item) => {
                const product = productMap.get(item.product.toString());
                const images = product?.image ? [product.image] : [];

                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product?.name || "Product",
                            images
                        },
                        unit_amount: Math.round(item.price * 100)
                    },
                    quantity: item.quantity
                };
            });

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                client_reference_id: order._id.toString(),
                metadata: {
                    orderId: order._id.toString()
                },
                payment_intent_data: {
                    metadata: {
                        orderId: order._id.toString()
                    }
                },
                line_items: lineItems,
                success_url: `${process.env.CLIENT_URL}/payment/success?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/payment/cancel?orderId=${order._id}`
            });

            order.paymentSessionId = session.id;
            await order.save();

            return res.status(200).json({ success: true, provider: "stripe", url: session.url });
        }

        if (provider === "razorpay") {
            const razorpay = getRazorpayClient();
            if (!razorpay) {
                return res.status(500).json({ success: false, message: "Razorpay is not configured" });
            }

            const order = new Order({
                buyer: req.userId,
                items: orderItems,
                totalAmount,
                status: "Pending",
                paymentStatus: "Pending",
                paymentProvider: "razorpay",
                currency: "INR"
            });

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: order._id.toString(),
                notes: {
                    orderId: order._id.toString(),
                    userId: req.userId?.toString()
                }
            });

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            return res.status(200).json({
                success: true,
                provider: "razorpay",
                keyId: process.env.RAZORPAY_KEY_ID,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderId: order._id.toString()
            });
        }

        return res.status(400).json({ success: false, message: "Invalid payment provider" });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const handleStripeWebhook = async (req, res) => {
    const stripe = getStripeClient();
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !stripeWebhookSecret) {
        return res.status(500).json({ success: false, message: "Stripe webhook is not configured" });
    }

    const signature = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const orderId = session.client_reference_id || session.metadata?.orderId;

                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, {
                        paymentStatus: "Paid",
                        status: "Processing",
                        paymentIntentId: session.payment_intent,
                        paymentSessionId: session.id,
                        paidAt: new Date()
                    });
                }
                break;
            }
            case "checkout.session.expired": {
                const session = event.data.object;
                const orderId = session.client_reference_id || session.metadata?.orderId;

                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, {
                        paymentStatus: "Failed",
                        status: "Cancelled",
                        paymentSessionId: session.id
                    });
                }
                break;
            }
            case "payment_intent.payment_failed": {
                const intent = event.data.object;
                if (intent.metadata?.orderId) {
                    await Order.findByIdAndUpdate(intent.metadata.orderId, {
                        paymentStatus: "Failed"
                    });
                }
                break;
            }
            default:
                break;
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Stripe webhook handling error:", error);
        return res.status(500).json({ success: false, message: "Webhook handler error" });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return res.status(400).json({ success: false, message: "Missing Razorpay payment details" });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: "Razorpay is not configured" });
        }

        const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Razorpay order mismatch" });
        }

        order.paymentStatus = "Paid";
        order.status = "Processing";
        order.paymentProvider = "razorpay";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paidAt = new Date();

        await order.save();

        return res.status(200).json({ success: true, message: "Payment verified", orderId: order._id.toString() });
    } catch (error) {
        console.error("Razorpay verification error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
