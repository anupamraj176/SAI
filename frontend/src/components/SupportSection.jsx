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
import toast from "react-hot-toast";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl bg-[#FFF6E9] border border-[#FFD9A0] shadow-sm overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#FAF1DD] transition"
      >
        <span className="font-semibold text-[#8C2F2B]">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-[#E66A32]" />
        ) : (
          <ChevronDown className="text-[#E66A32]" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-[#FDF6E9] border-t border-[#FFD9A0] text-[#C24C30] text-sm">
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportSection = () => {
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
      toast.success("Support ticket submitted!");
      setFormData({ ...formData, subject: "", message: "" });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#8C2F2B] mb-10 flex items-center gap-3">
        <HelpCircle className="text-[#E66A32]" /> Help & Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT: CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFF6E9] p-8 rounded-2xl shadow-md border border-[#FFD9A0]"
        >
          <h2 className="text-xl font-bold text-[#C24C30] mb-6">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-[#FFB444]" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF3E3] border border-[#FFD9A0] rounded-lg 
                             focus:ring-2 focus:ring-[#E66A32] focus:outline-none text-[#2B2B2B]"
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
                <Mail className="absolute left-3 top-3 text-[#FFB444]" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@mail.com"
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF3E3] border border-[#FFD9A0] rounded-lg 
                             focus:ring-2 focus:ring-[#E66A32] focus:outline-none text-[#2B2B2B]"
                  required
                />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                Subject
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-[#FFB444]" size={18} />

                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="
                    w-full pl-10 pr-10 py-2 bg-[#FAF3E3]
                    border border-[#FFD9A0] rounded-lg text-[#2B2B2B]
                    focus:ring-2 focus:ring-[#E66A32] outline-none transition
                    appearance-none cursor-pointer
                  "
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>

                <ChevronDown
                  className="absolute right-3 top-3 text-[#C24C30]"
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
                placeholder="Describe your issue..."
                className="w-full px-4 py-2 bg-[#FAF3E3] border border-[#FFD9A0] rounded-lg 
                           focus:ring-2 focus:ring-[#E66A32] text-[#2B2B2B] h-32 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C24C30] hover:bg-[#9E2B26] text-white font-bold py-3 rounded-lg 
                         transition shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </button>
          </form>
        </motion.div>

        {/* RIGHT: FAQ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-[#C24C30] mb-6">FAQ</h2>

          <div className="space-y-4">
            <FAQItem
              question="How do I track my order?"
              answer="You can track your order in the My Orders section. Status updates are real-time."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We currently support Cash on Delivery and direct transfers. Online payments coming soon."
            />
            <FAQItem
              question="How can I become a seller?"
              answer="You can sign up as a farmer or request support to convert your account."
            />
            <FAQItem
              question="What is your return policy?"
              answer="Due to perishable goods, returns are accepted only for damaged items within 24 hours."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportSection;
