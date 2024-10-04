// @ts-nocheck

"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Sparkles, Mic, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AdvancedAIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (query) => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsLoading(true);
    setError(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}`;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": `${process.env.NEXT_PUBLIC_APIKEY_URL}`,
          "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_APIHOST}`,
        },
        body: JSON.stringify({
          query,
        }),
      };

      const res = await fetch(url, options);
      const response = await res.json();

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const aiResponse = response.response;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle button actions
  const handleAction = (actionType) => {
    let query;
    switch (actionType) {
      case "summary":
        query = "Please generate a summary.";
        break;
      case "jobFit":
        query = "Check job fit for me.";
        break;
      case "trainingStyle":
        query = "Analyze training style.";
        break;
      default:
        query = "";
    }

    handleSubmit(query);
  };

  const handleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in your browser.")
      return
    }
  
    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
  
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
      setInput(transcript)
    }
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
    }
  
    recognition.start()
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/3 p-6 bg-green-50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-green-500" />
              <span className="text-xl font-semibold text-gray-800">
                VI AI Assistant
              </span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-white text-gray-800 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => handleAction("summary")}
            >
              Generate Summary
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-white text-gray-800 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => handleAction("jobFit")}
            >
              Check Job Fit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-white text-gray-800 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => handleAction("trainingStyle")}
            >
              Analyze Training Style
            </motion.button>
          </div>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col">
          {/* Chat Scrollable Area */}
          <div
            ref={scrollAreaRef}
            className="flex-grow overflow-y-auto space-y-4 mb-4 h-[300px] md:h-[500px] scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-green-500"
          >
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full py-3 px-4 pr-24 bg-gray-100 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                type="button"
                onClick={handleSpeechRecognition}
                disabled={isLoading}
                className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50"
              >
                {isListening ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
          <div className="mt-4">
            <button className="flex items-center space-x-2 text-green-500 hover:text-green-600">
              <Sparkles className="w-5 h-5" />
              <span>Topics</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
