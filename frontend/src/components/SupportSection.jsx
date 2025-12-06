import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useSupportStore } from "../store/supportStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#FFD9A0] rounded-lg bg-white overflow-hidden mb-3 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#FDF6E9] transition-colors"
      >
        <span className="font-bold text-[#2B2B2B]">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-[#FF8C42]" />
        ) : (
          <ChevronDown className="text-[#FF8C42]" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-[#FDF6E9] text-[#8C2F2B] text-sm border-t border-[#FFD9A0]">
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportSection = () => {
  // We don't need 'user' for pre-filling anymore
  const { createTicket, isLoading } = useSupportStore();

  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createTicket(formData);
    if (result.success) {
      toast.success("Support ticket submitted successfully!");
      setFormData({ ...formData, subject: "", message: "" });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8 flex items-center gap-3">
        <HelpCircle className="text-[#FF8C42]" /> Help & Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-xl shadow-md border border-[#FFD9A0]"
        >
          <h2 className="text-xl font-bold text-[#C24C30] mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Your Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-[#FFD9A0]"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B] placeholder-[#8C2F2B]/40"
                  placeholder="Your Full Name" 
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-[#FFD9A0]"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                  placeholder="Your Email Address"
                  required
                />
              </div>
            </div>

            {/* Subject (dropdown – fully custom container) */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Subject
              </label>
              <div className="relative">
                {/* Left Icon */}
                <MessageSquare
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD9A0] pointer-events-none z-10"
                  size={18}
                />
                
                {/* Select Input */}
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="
                    w-full
                    pl-10
                    pr-10
                    py-2
                    bg-[#FDF6E9]
                    border
                    border-[#FFD9A0]
                    rounded-lg
                    focus:outline-none
                    focus:border-[#FF8C42]
                    focus:ring-0
                    text-[#2B2B2B]
                    appearance-none
                    cursor-pointer
                    transition-colors
                  "
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>

                {/* Right Icon */}
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF8C42] pointer-events-none z-10"
                  size={18}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B] h-32 resize-none"
                placeholder="Describe your issue..."
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C24C30] hover:bg-[#A03B23] text-white font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </button>
          </form>
        </motion.div>

        {/* FAQs */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-bold text-[#C24C30] mb-6">
            Frequently Asked Questions
          </h2>
          <FAQItem
            question="How do I track my order?"
            answer="You can track your order status in the 'My Orders' section of your dashboard. We update the status in real-time."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="Currently, we support Cash on Delivery (COD) and direct bank transfers. Online payment gateway integration is coming soon."
          />
          <FAQItem
            question="How can I become a seller?"
            answer="If you are a farmer, you can register as a seller during the signup process. If you already have a buyer account, please contact support to upgrade."
          />
          <FAQItem
            question="What is your return policy?"
            answer="Due to the perishable nature of the products, returns are only accepted if the goods are damaged upon delivery. Please report issues within 24 hours."
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SupportSection;
