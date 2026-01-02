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
    <div className="rounded-xl bg-[#E8F5E9] border border-[#6FA99F] shadow-sm overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#C8E6C9] transition"
      >
        <span className="font-semibold text-[#1F3326]">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-[#347B66]" />
        ) : (
          <ChevronDown className="text-[#347B66]" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-[#E8F5E9] border-t border-[#6FA99F] text-[#3B4A38] text-sm">
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
      <h1 className="text-3xl font-bold text-[#1F3326] mb-10 flex items-center gap-3">
        <HelpCircle className="text-[#347B66]" /> Help & Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT: CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#E8F5E9] p-8 rounded-2xl shadow-md border border-[#6FA99F]"
        >
          <h2 className="text-xl font-bold text-[#347B66] mb-6">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1F3326] mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-[#347B66]" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 bg-[#E8F5E9] border border-[#6FA99F] rounded-lg 
                             focus:ring-2 focus:ring-[#347B66] focus:outline-none text-[#1F3326]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1F3326] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#347B66]" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@mail.com"
                  className="w-full pl-10 pr-4 py-2 bg-[#E8F5E9] border border-[#6FA99F] rounded-lg 
                             focus:ring-2 focus:ring-[#347B66] focus:outline-none text-[#1F3326]"
                  required
                />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[#1F3326] mb-1">
                Subject
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-[#347B66]" size={18} />

                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="
                    w-full pl-10 pr-10 py-2 bg-[#E8F5E9]
                    border border-[#6FA99F] rounded-lg text-[#1F3326]
                    focus:ring-2 focus:ring-[#347B66] outline-none transition
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
                  className="absolute right-3 top-3 text-[#347B66]"
                  size={18}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#1F3326] mb-1">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Describe your issue..."
                className="w-full px-4 py-2 bg-[#E8F5E9] border border-[#6FA99F] rounded-lg 
                           focus:ring-2 focus:ring-[#347B66] text-[#1F3326] h-32 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#347B66] hover:bg-[#1F3326] text-white font-bold py-3 rounded-lg 
                         transition shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </button>
          </form>
        </motion.div>

        {/* RIGHT: FAQ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-[#347B66] mb-6">FAQ</h2>

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
