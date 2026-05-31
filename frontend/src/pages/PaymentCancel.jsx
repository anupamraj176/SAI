import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F3326] via-[#347B66] to-[#6FA99F] p-6">
            <div className="bg-[#E8F5E9] max-w-lg w-full rounded-2xl shadow-xl border border-[#6FA99F] p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1F3326] mb-2">Payment cancelled</h1>
                <p className="text-sm text-[#3B4A38] mb-6">
                    Your payment was cancelled{orderId ? ` (Order ID: ${orderId})` : ""}. You can try again from your cart.
                </p>
                <button
                    onClick={() => navigate("/dashboard?section=cart")}
                    className="w-full bg-gradient-to-r from-[#347B66] to-[#1F3326] hover:opacity-90 text-white font-bold py-3 rounded-lg transition shadow-md"
                >
                    Return to Cart
                </button>
            </div>
        </div>
    );
};

export default PaymentCancel;
