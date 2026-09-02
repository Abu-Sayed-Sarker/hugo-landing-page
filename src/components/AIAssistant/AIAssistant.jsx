"use client";
import { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronDown,
  Send,
  Edit,
  Mic,
  AudioLines,
  Trash2,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import robotLottie from "../../assets/lottie/robot.json";
import { useChatWithAIMutation } from "../../Api/aiApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useGetAIChatHistoryQuery,
  useLazyGetAISessionHistoryQuery,
  useDeleteAIChatSessionMutation,
} from "../../Api/chatApi";
import toast from "react-hot-toast";

export default function AIAssistant() {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("idle"); // idle | listening | error | unsupported
  const [historyOpen, setHistoryOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatWithAI, { isLoading: isChatLoading }] = useChatWithAIMutation();
  const { data: historyData, refetch: refetchHistory } =
    useGetAIChatHistoryQuery();
  const [triggerGetSessionHistory] = useLazyGetAISessionHistoryQuery();
  const [deleteChatSession] = useDeleteAIChatSessionMutation();

  // Native SpeechRecognition ref — no library needed
  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const speechBaseInputRef = useRef("");
  const savedTranscriptRef = useRef("");
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isChatLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const maxHeight = 224;
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${nextHeight}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [input]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSelectChat = async (item) => {
    setCurrentChatId(item.id);
    try {
      const response = await triggerGetSessionHistory(item.id).unwrap();
      if (response?.chat_history) {
        const fullHistory = response.chat_history.flatMap((msg) => [
          {
            id: `${msg.id}-user`,
            text: msg.user_message,
            sender: "user",
            timestamp: new Date(msg.created_at || msg.timestamp),
          },
          {
            id: `${msg.id}-ai`,
            text: msg.ai_response,
            sender: "ai",
            timestamp: new Date(msg.created_at || msg.timestamp),
          },
        ]);
        setMessages(fullHistory);
      }
    } catch (error) {
      console.error("Failed to fetch session history:", error);
    }
  };

  const truncateTitle = (text) => {
    if (!text) return "Chat sin título";
    const words = text.split(" ");
    if (words.length <= 4) return text;
    return words.slice(0, 4).join(" ") + "...";
  };

  const groupHistory = (items) => {
    if (!items) return {};
    const groups = {
      Hoy: [],
      Ayer: [],
      "Última Semana": [],
      "Último Mes": [],
      "Más antiguo": [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const sortedItems = [...items].sort(
      (a, b) =>
        new Date(b.created_at || b.timestamp) -
        new Date(a.created_at || a.timestamp),
    );

    sortedItems.forEach((item) => {
      const date = new Date(item.created_at || item.timestamp);
      const itemDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      if (itemDate >= today) {
        groups.Hoy.push(item);
      } else if (itemDate >= yesterday) {
        groups.Ayer.push(item);
      } else if (itemDate >= lastWeek) {
        groups["Última Semana"].push(item);
      } else if (itemDate >= lastMonth) {
        groups["Último Mes"].push(item);
      } else {
        groups["Más antiguo"].push(item);
      }
    });

    return groups;
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteChatSession(sessionId).unwrap();
      toast.success("Chat eliminado con éxito");
      if (currentChatId === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to delete chat session:", error);
      toast.error("Error al eliminar el chat");
    }
  };

  const groupedHistory = groupHistory(historyData?.sessions);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
        text: input,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);

      const userInput = input;
      setInput("");

      try {
        const payload = { message: userInput };
        if (currentChatId) {
          payload.session_id = currentChatId;
        }

        const response = await chatWithAI(payload).unwrap();

        const aiMessage = {
          id: Date.now() + 1,
          text: response.response || "Lo siento, no pude entender eso.",
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        refetchHistory();

        if (!currentChatId && response.session_id) {
          setCurrentChatId(response.session_id);
        }
      } catch (error) {
        console.error("Failed to stream chat:", error);
        const errorMessage = {
          id: Date.now() + 1,
          text: "Lo siento, algo salió mal. Por favor, inténtalo de nuevo.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  // ✅ Native Web Speech API — keeps listening until the user stops it
  const handleVoiceInput = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceStatus("unsupported");
      toast.error("El reconocimiento de voz no es compatible con este navegador");
      return;
    }

    // User manually stops the mic
    if (voiceStatus === "listening") {
      shouldKeepListeningRef.current = false;
      recognitionRef.current?.stop();
      setVoiceStatus("idle");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    shouldKeepListeningRef.current = true;
    speechBaseInputRef.current = input.trim();
    savedTranscriptRef.current = "";

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceStatus("listening");
      console.log("🎤 Listening started");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          savedTranscriptRef.current =
            `${savedTranscriptRef.current} ${transcriptPiece}`.trim();
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      const nextInput = [
        speechBaseInputRef.current,
        savedTranscriptRef.current,
        interimTranscript.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      setInput(nextInput);
      console.log("📝 Transcript:", nextInput);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        shouldKeepListeningRef.current = false;
        setVoiceStatus("error");
        toast.error(
          "Acceso al micrófono denegado. Por favor, permítelo en la configuración del navegador.",
        );
        return;
      }

      if (event.error === "network") {
        shouldKeepListeningRef.current = false;
        setVoiceStatus("error");
        toast.error("Error de red con el reconocimiento de voz.");
        return;
      }

      if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error(`Error de voz: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
          console.log("🔁 Listening restarted automatically");
        } catch (error) {
          console.error("Failed to restart listening:", error);
          shouldKeepListeningRef.current = false;
          setVoiceStatus("idle");
        }
      } else {
        setVoiceStatus("idle");
        console.log("⏹ Listening stopped by user");
      }
    };

    recognition.start();
    console.log("🎤 startListening() called via native API");
  };


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-xl w-full flex flex-col h-screen">
        {/* Header */}
        <div className="bg-primary text-white px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden hover:bg-blue-800 p-1 rounded transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">Asistente de IA</h1>
          </div>
          <Link to={"/"}>
            <button className="hover:bg-blue-800 p-1 rounded transition-colors">
              <X size={24} />
            </button>
          </Link>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="absolute inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`absolute md:relative z-50 h-full w-72 sm:w-80 bg-white text-primary font-medium flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="flex justify-between items-center mx-4 mt-4 md:hidden">
              <span className="font-semibold text-gray-700">Menú</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500 hover:text-gray-800 rounded">
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => { handleNewChat(); setSidebarOpen(false); }}
              className="m-4 mb-8 flex text-[#374151] items-center gap-2 px-4 py-3 rounded-lg transition-colors border hover:bg-gray-50"
            >
              <Edit size={20} />
              <span className="font-medium">Nuevo Chat</span>
            </button>

            <div className="flex-1 overflow-y-auto px-4">
              {historyData?.sessions?.length > 0 &&
                <button
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className="flex items-center gap-2 w-full mb-5 px-3 transition-colors text-[#374151]"
                >
                  <span className="font-semibold">Historial de Chat</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: historyOpen ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
              }

              {historyOpen && (
                <div className="space-y-6">
                  {Object.entries(groupedHistory).map(
                    ([groupName, items]) =>
                      items.length > 0 && (
                        <div key={groupName}>
                          <h3 className="text-xs font-bold text-gray-400 uppercase px-3 mb-2">
                            {groupName}
                          </h3>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => { handleSelectChat(item); setSidebarOpen(false); }}
                                className={`group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentChatId === item.id
                                  ? "bg-blue/10 text-blue font-semibold"
                                  : "text-[#374151] hover:bg-gray-50"
                                  }`}
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center justify-between gap-2 overflow-hidden">
                                    <span
                                      className="truncate text-sm"
                                      title={item.first_message}
                                    >
                                      {truncateTitle(item.first_message)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                                      {new Date(
                                        item.created_at || item.timestamp,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) =>
                                    handleDeleteSession(e, item.id)
                                  }
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-base min-w-0">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col max-w-7xl mx-auto w-full">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center -space-y-24">
                    <div className="">
                      <Lottie animationData={robotLottie}></Lottie>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 my-4">
                        Hola, soy Hugo.
                      </p>
                      <p className="text-gray-600 text-lg md:text-xl">
                        ¿En qué te puedo ayudar?
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-12 h-12 flex text-white items-center justify-center bg-primary rounded-full font-medium text-lg flex-shrink-0">
                          <span>AI</span>
                        </div>
                      )}
                      <div
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-2xl px-4 py-2 rounded-lg ${msg.sender === "user"
                            ? "bg-blue text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                            }`}
                        >
                          {msg.sender === "ai" ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => (
                                  <p className="mb-2 last:mb-0" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul
                                    className="list-disc ml-4 mb-2"
                                    {...props}
                                  />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol
                                    className="list-decimal ml-4 mb-2"
                                    {...props}
                                  />
                                ),
                                li: ({ node, ...props }) => (
                                  <li className="mb-1" {...props} />
                                ),
                                h1: ({ node, ...props }) => (
                                  <h1
                                    className="text-xl font-bold mb-2 mt-4"
                                    {...props}
                                  />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2
                                    className="text-lg font-bold mb-2 mt-3"
                                    {...props}
                                  />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3
                                    className="text-md font-bold mb-2 mt-2"
                                    {...props}
                                  />
                                ),
                                strong: ({ node, ...props }) => (
                                  <strong className="font-bold" {...props} />
                                ),
                                em: ({ node, ...props }) => (
                                  <em className="italic" {...props} />
                                ),
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          ) : (
                            <p className="">{msg.text}</p>
                          )}
                        </div>
                        <p className={`text-[10px] text-gray-400 mt-1`}>
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : ""}
                        </p>
                      </div>
                      {msg.sender === "user" && (
                        <div className="w-12 h-12 flex text-blue items-center justify-center border text-lg border-blue rounded-full font-semibold flex-shrink-0">
                          <span>U</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isChatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-12 h-12 flex text-white items-center justify-center bg-primary rounded-full font-medium text-lg flex-shrink-0">
                        <span>AI</span>
                      </div>
                      <div className="px-4 py-3 bg-gray-200 text-gray-900 rounded-lg rounded-bl-none flex items-center">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8">
              <div className="flex border mx-auto max-w-4xl items-center bg-white rounded-lg border-gray-300 shadow-sm">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Escribe tu mensaje..."
                  rows={1}
                  className="flex-1 px-4 py-4 bg-transparent outline-none focus:outline-none transition-colors resize-none overflow-y-hidden max-h-56"
                />

                {/* Voice Input Button */}
                <button
                  onClick={handleVoiceInput}
                  className={`self-center p-2 mr-2 rounded-full transition-all duration-200 flex items-center justify-center ${voiceStatus === "listening"
                    ? "text-primary"
                    : "text-grayText hover:text-primary"
                    }`}
                  title="Hablar"
                >
                  {voiceStatus === "listening" ? (
                    <AudioLines size={20} className="animate-pulse" />
                  ) : (
                    <Mic size={20} />
                  )}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isChatLoading}
                  className={`bg-primary hover:bg-blue-800 text-white p-3 px-5 rounded-r-lg transition-colors flex items-center justify-center self-stretch ${isChatLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Send size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
