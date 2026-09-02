import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { useGetConversationsQuery, useGetChatHistoryQuery } from "../../Api/chatApi";
import { useSelector } from "react-redux";

export default function MessageInterface() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeRoomMessages, setActiveRoomMessages] = useState([]);
  const { data: conversationList, refetch: refetchConversations } = useGetConversationsQuery();
  const { data: historyData } = useGetChatHistoryQuery(selectedConversation, {
    skip: !selectedConversation,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (conversationList) {
      const formattedConversations = conversationList.map((conv) => {
        const uniName = conv.other_user?.univ_name || "Universidad Desconocida";
        const shortName = conv.other_user?.short_name;

        let avatarText = "U";
        if (shortName && shortName !== "N/A") {
          avatarText = shortName;
        } else {
          avatarText = uniName.substring(0, 2).toUpperCase();
        }

        return {
          id: conv.id,
          name: uniName,
          message: conv.last_message || "",
          time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          hasBlueIndicator: false,
          avatar: avatarText,
        };
      });
      setConversations(formattedConversations);
    }
  }, [conversationList]);

  // Handle history data
  useEffect(() => {
    if (historyData?.chat_history && selectedConversation) {
      const historyMessages = historyData.chat_history.map((msg) => ({
        id: msg.timestamp + msg.sender,
        sender: msg.sender_role === "student" ? "me" : "them",
        text: msg.text,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setActiveRoomMessages(historyMessages);
    } else if (!selectedConversation) {
      setActiveRoomMessages([]);
    }
  }, [historyData, selectedConversation]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedConversation, activeRoomMessages]);

  const token = useSelector((state) => state.auth.accessToken);
  const socketRef = useRef(null);

  // WebSocket Connection
  useEffect(() => {
    if (selectedConversation && token) {
      const wsUrl = `wss://api.clasia.io/ws/chat/${selectedConversation}/?token=${token}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("WebSocket Connected");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          const newMsg = {
            id: Date.now(),
            sender: data.role === "student" ? "me" : "them",
            text: data.message,
            time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setActiveRoomMessages(prev => [...prev, newMsg]);
          refetchConversations();
        }
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [selectedConversation, token]);

  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 224)}px`; // 224px is max-h-56
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation && socketRef.current) {
      const messagePayload = {
        message: messageInput
      };
      socketRef.current.send(JSON.stringify(messagePayload));
      setMessageInput("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px"; // min-h-10
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-base pt-20">
      {/* Left Sidebar - Conversation List */}
      <div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-80 bg-white border-r border-gray-200 flex-col`}>
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Mensajes</h2>

          {/* Search Bar */}
          {/* <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div> */}

          {/* Conversation List */}
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${selectedConversation === conv.id ? "bg-blue-50" : ""
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-sky rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                    {conv.avatar}
                  </div>
                  {conv.hasBlueIndicator && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-sm truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {conv.message}
                  </p>
                  {conv.subtext && (
                    <p className="text-xs text-green-600 mt-0.5">
                      {conv.subtext}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Chat or Empty State */}
      <div className={`${!selectedConversation ? "hidden md:flex" : "flex"} flex-1 flex-col min-w-0`}>
        {!selectedConversation ? (
          // Empty State
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-500 text-sm">
                Elige una conversación de la lista para ver los mensajes
                <br />
                y responder a las consultas
              </p>
            </div>
          </div>
        ) : (
          // Chat View
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                  {
                    conversations.find((c) => c.id === selectedConversation)
                      ?.avatar
                  }
                </div>
                <div>
                  <h3 className="font-semibold">
                    {
                      conversations.find((c) => c.id === selectedConversation)
                        ?.name
                    }
                  </h3>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
              <div className="space-y-4 max-w-3xl mx-auto">
                {activeRoomMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex gap-2 max-w-md ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"
                        }`}
                    >
                      {msg.sender === "them" && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
                          {
                            conversations.find(
                              (c) => c.id === selectedConversation
                            )?.avatar
                          }
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-2 rounded-2xl ${msg.sender === "me"
                            ? "bg-blue text-white"
                            : "bg-white text-gray-800"
                            }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${msg.sender === "me" ? "text-right" : "text-left"
                            }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-3xl mx-auto flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  rows="1"
                  className="flex-1 px-4 py-2 border border-gray rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto min-h-10 max-h-56 leading-relaxed"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 mb-0.5 bg-blue text-white rounded-full hover:bg-blue-700 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
