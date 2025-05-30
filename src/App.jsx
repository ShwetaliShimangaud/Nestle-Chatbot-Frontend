import { useState, useRef, useEffect } from "react";

export default function App() {
  const localpath = "http://localhost:8000/api/chat"
  const cloudpath = "https://fastapi-backend-986893157554.northamerica-northeast1.run.app/api/chat"

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! How can I help you today?" },
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send message to backend
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(cloudpath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Assuming your backend response is { reply: "..." }
      const botMessage = { from: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { from: "bot", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, errorMsg]);
      console.error("Error sending message:", error);
    }
  }

  // Handle enter key press in input
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  // Helper to detect and convert URLs into anchor tags
// const renderMessageText = (text) => {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const parts = text.split(urlRegex);
//   return parts.map((part, i) =>
//     urlRegex.test(part) ? (
//       <a
//         key={i}
//         href={part}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 underline break-words"
//       >
//         {part}
//       </a>
//     ) : (
//       <span key={i}>{part}</span>
//     )
//   );
// };

const renderBasicMarkdown = (text) => {
  const escapeHTML = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const escaped = escapeHTML(text);

  // Regex order matters to prevent conflicts
  const tokens = [];
  let remaining = escaped;

  const patterns = [
    { regex: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/, type: "mdlink" }, // [text](url)
    { regex: /(https?:\/\/[^\s]+)/, type: "url" },                     // raw url
    { regex: /(\*\*)(.*?)\1/, type: "bold" },                          // **bold**
    { regex: /(_)(.*?)\1/, type: "italic" },                           // _italic_
    { regex: /(`)(.*?)\1/, type: "code" },                             // `code`
  ];

  while (remaining.length > 0) {
    let earliest = null;
    let matchType = null;

    for (const { regex, type } of patterns) {
      const match = regex.exec(remaining);
      if (match && (!earliest || match.index < earliest.index)) {
        earliest = match;
        matchType = type;
      }
    }

    if (!earliest) {
      tokens.push({ type: "text", content: remaining });
      break;
    }

    if (earliest.index > 0) {
      tokens.push({ type: "text", content: remaining.slice(0, earliest.index) });
    }

    switch (matchType) {
      case "mdlink":
        tokens.push({ type: "link", text: earliest[1], href: earliest[2] });
        break;
      case "url":
        tokens.push({ type: "link", text: earliest[0], href: earliest[0] });
        break;
      case "bold":
        tokens.push({ type: "bold", content: earliest[2] });
        break;
      case "italic":
        tokens.push({ type: "italic", content: earliest[2] });
        break;
      case "code":
        tokens.push({ type: "code", content: earliest[2] });
        break;
    }

    remaining = remaining.slice(earliest.index + earliest[0].length);
  }

  return tokens.map((token, i) => {
    switch (token.type) {
      case "text":
        return <span key={i}>{token.content}</span>;
      case "bold":
        return <strong key={i}>{token.content}</strong>;
      case "italic":
        return <em key={i}>{token.content}</em>;
      case "code":
        return (
          <code
            key={i}
            className="bg-gray-100 px-1 rounded text-sm font-mono text-red-600"
          >
            {token.content}
          </code>
        );
      case "link":
        return (
          <a
            key={i}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-words"
          >
            {token.text}
          </a>
        );
      default:
        return null;
    }
  });
};


  return (
  <div className="relative w-full h-screen overflow-hidden">
    {/* Background image */}
    <img
      src="/background-image.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />

    <div className="bg-blue-500 text-white p-10">
      <h1 className="text-4xl">Tailwind is working?</h1>
    </div>

    <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700"
    >
      💬
    </button>

    {isChatOpen && (
      <div className="fixed bottom-20 right-6 z-50 w-96 h-96 bg-white rounded-xl shadow-xl p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Nestlé Chatbot</h2>
          <button onClick={() => setIsChatOpen(false)}>✖</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto border-t mt-2 pt-2 space-y-2 pr-1">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {renderBasicMarkdown(msg.text)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Type a message..."
          className="mt-2 border w-full px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    )}
  </div>
);
}