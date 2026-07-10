import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { useOrderStore } from "../../../store/orderStore";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const UserCart = ({ setActiveSection }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
    const { createCheckoutSession, verifyRazorpayPayment, isLoading: isOrderLoading } = useOrderStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const result = await createCheckoutSession(cart);

        if (result.success) {
            if (result.provider === "stripe") {
                window.location.href = result.url;
                return;
            }

            if (result.provider === "razorpay") {
                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                    toast.error("Failed to load Razorpay. Please try again.");
                    return;
                }

                const options = {
                    key: result.keyId,
                    amount: result.amount,
                    currency: result.currency,
                    name: "FarmerHub",
                    description: "Order Payment",
                    order_id: result.razorpayOrderId,
                    prefill: {
                        name: user?.name || "",
                        email: user?.email || "",
                        contact: user?.phoneNumber || ""
                    },
                    handler: async (response) => {
                        const verifyResult = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: result.orderId
                        });

                        if (verifyResult.success) {
                            navigate(`/payment/success?orderId=${result.orderId}`);
                        } else {
                            toast.error(verifyResult.message || "Payment verification failed");
                        }
                    },
                    modal: {
                        ondismiss: () => toast.error("Payment cancelled")
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
                return;
            }

            toast.error("Unsupported payment provider");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1F3326] mb-8">Your Cart</h1>

            {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                className="bg-[#E8F5E9] p-4 rounded-xl shadow-md border border-[#6FA99F] flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-lg transition"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-lg bg-[#C8E6C9]"
                                />

                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-[#1F3326] text-lg sm:text-base">{item.name}</h3>
                                    <p className="text-sm text-[#3B4A38]">₹{item.price} / unit</p>
                                </div>

                                <div className="flex justify-between items-center w-full sm:w-auto gap-4">
                                    {/* QUANTITY SELECTOR */}
                                    <div className="flex items-center gap-3 bg-[#C8E6C9] rounded-lg p-1 border border-[#6FA99F]">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="p-1 hover:bg-[#6FA99F] rounded transition"
                                        >
                                            <Minus size={16} className="text-[#347B66]" />
                                        </button>

                                        <span className="font-bold text-[#1F3326] w-4 text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-1 hover:bg-[#6FA99F] rounded transition"
                                        >
                                            <Plus size={16} className="text-[#347B66]" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#E8F5E9] p-6 rounded-xl shadow-lg border border-[#6FA99F] sticky top-4">
                            <h3 className="text-xl font-bold text-[#1F3326] mb-4">Order Summary</h3>

                            <div className="space-y-2 mb-4 text-sm text-[#3B4A38]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal(cart)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-[#6FA99F] pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg text-[#347B66]">
                                    <span>Total</span>
                                    <span>₹{getCartTotal(cart)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isOrderLoading}
                                className="w-full bg-gradient-to-r from-[#347B66] to-[#1F3326] hover:opacity-90 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-50"
                            >
                                {isOrderLoading ? "Processing..." : "Proceed to Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-[#3B4A38]/50">
                    <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-40" />
                    <p className="text-xl font-medium">Your cart is empty</p>
                    <button
                        onClick={() => setActiveSection("market")}
                        className="mt-4 text-[#347B66] hover:underline font-medium"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserCart;
