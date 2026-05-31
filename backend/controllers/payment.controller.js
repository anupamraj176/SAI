import Stripe from "stripe";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";
import { buildOrderItems } from "../utils/orderPricing.js";

dotenv.config();

let stripeClient = null;

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

export const createCheckoutSession = async (req, res) => {
    try {
        const stripe = getStripeClient();
        if (!stripe) {
            return res.status(500).json({ success: false, message: "Stripe is not configured" });
        }
        if (!process.env.CLIENT_URL) {
            return res.status(500).json({ success: false, message: "CLIENT_URL is not configured" });
        }

        const { items } = req.body;
        const { orderItems, totalAmount, productMap, error } = await buildOrderItems(items);

        if (error) {
            return res.status(400).json({ success: false, message: error });
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

        return res.status(200).json({ success: true, url: session.url });
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
