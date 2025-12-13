import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import toast from "react-hot-toast";

const UserCart = ({ setActiveSection }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
    const { createOrder, isLoading: isOrderLoading } = useOrderStore();

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const total = getCartTotal(cart);
        const result = await createOrder(cart, total);

        if (result.success) {
            toast.success("Order placed successfully!");
            clearCart();
            setActiveSection("orders");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Your Cart</h1>

            {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                className="bg-[#FFF6E9] p-4 rounded-xl shadow-md border border-[#EAD7BD] flex gap-4 items-center hover:shadow-lg transition"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg bg-[#FAF3E3]"
                                />

                                <div className="flex-1">
                                    <h3 className="font-bold text-[#2B2B2B]">{item.name}</h3>
                                    <p className="text-sm text-[#8C2F2B]">₹{item.price} / unit</p>
                                </div>

                                {/* QUANTITY SELECTOR */}
                                <div className="flex items-center gap-3 bg-[#FAF3E3] rounded-lg p-1 border border-[#EAD7BD]">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="p-1 hover:bg-[#FFD9A0] rounded transition"
                                    >
                                        <Minus size={16} className="text-[#C24C30]" />
                                    </button>

                                    <span className="font-bold text-[#2B2B2B] w-4 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-1 hover:bg-[#FFD9A0] rounded transition"
                                    >
                                        <Plus size={16} className="text-[#C24C30]" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-gray-400 hover:text-[#C24C30] transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#FFF6E9] p-6 rounded-xl shadow-lg border border-[#EAD7BD] sticky top-4">
                            <h3 className="text-xl font-bold text-[#2B2B2B] mb-4">Order Summary</h3>

                            <div className="space-y-2 mb-4 text-sm text-[#6A5746]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal(cart)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-[#EAD7BD] pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg text-[#C24C30]">
                                    <span>Total</span>
                                    <span>₹{getCartTotal(cart)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isOrderLoading}
                                className="w-full bg-gradient-to-r from-[#C24C30] to-[#8C2F2B] hover:opacity-90 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-50"
                            >
                                {isOrderLoading ? "Processing..." : "Proceed to Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-[#C24C30]/50">
                    <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-40" />
                    <p className="text-xl font-medium">Your cart is empty</p>
                    <button
                        onClick={() => setActiveSection("market")}
                        className="mt-4 text-[#E66A32] hover:underline font-medium"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserCart;
