import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Namaste! I am CropSense AI. How can I help you with your farm today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Automatically scroll to bottom when new messages arrive
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message to UI
        const userText = input;
        setMessages((prev) => [...prev, { sender: "user", text: userText }]);
        setInput("");
        setIsLoading(true);

        try {
            // Call the new streaming FastAPI backend!
            const response = await fetch("http://localhost:8000/api/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userText, 
                    thread_id: "user_session_1"
                })
            });

            // Prepare to read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            
            // Add an empty AI message to the UI that we will append to token-by-token
            setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
            setIsLoading(false); // Stop loading spinner as soon as the first token arrives

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            setMessages((prev) => {
                                const newMessages = [...prev];
                                // Append the new token to the last message's text
                                newMessages[newMessages.length - 1].text += data.content;
                                return newMessages;
                            });
                        } catch (e) {
                            // ignore partial JSON errors
                        }
                    }
                }
            }
            
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I am offline right now. Please try again later!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            
            {/* THE CHAT WINDOW (Only visible if isOpen is true) */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 transition-all duration-300 transform origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-[#347B66] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <h3 className="font-bold">CropSense AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 h-96 p-4 overflow-y-auto bg-[#F9FAFB] flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`max-w-[80%] p-3 rounded-2xl ${
                                    msg.sender === "user" 
                                    ? "bg-[#347B66] text-white self-end rounded-tr-none" 
                                    : "bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm"
                                }`}
                            >
                                {msg.sender === "user" ? (
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                ) : (
                                    <div className="text-sm [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>strong]:font-bold">
                                        <ReactMarkdown>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="bg-white border border-gray-200 text-gray-500 self-start p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about crops..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#347B66]"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-[#347B66] text-white p-2 rounded-full hover:bg-[#1F3326] transition disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* THE FLOATING BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-[#347B66] hover:bg-[#1F3326] text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default ChatWidget;
