import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { useCartStore } from "../store/cartStore";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { fetchUserOrders } = useOrderStore();
    const { clearCart } = useCartStore();

    useEffect(() => {
        clearCart();
        fetchUserOrders();
    }, [clearCart, fetchUserOrders]);

    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F3326] via-[#347B66] to-[#6FA99F] p-6">
            <div className="bg-[#E8F5E9] max-w-lg w-full rounded-2xl shadow-xl border border-[#6FA99F] p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1F3326] mb-2">Payment successful</h1>
                <p className="text-sm text-[#3B4A38] mb-6">
                    Your payment is confirmed{orderId ? ` (Order ID: ${orderId})` : ""}. Your order is now processing.
                </p>
                <button
                    onClick={() => navigate("/dashboard?section=orders")}
                    className="w-full bg-gradient-to-r from-[#347B66] to-[#1F3326] hover:opacity-90 text-white font-bold py-3 rounded-lg transition shadow-md"
                >
                    View Orders
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
