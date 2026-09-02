import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Paperclip, Smile } from "lucide-react";
import { useGetConversationsQuery, useGetChatHistoryQuery } from "../../../Api/chatApi";
import { useSelector } from "react-redux";

export default function Chat() {
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
        const isStudent = conv.other_user?.type === "Student";
        const displayName = isStudent
          ? conv.other_user?.student_name
          : (conv.other_user?.univ_name || "Usuario Desconocido");

        let avatarText = "U";
        if (isStudent && conv.other_user?.initials) {
          avatarText = conv.other_user.initials;
        } else if (conv.other_user?.short_name && conv.other_user?.short_name !== "N/A") {
          avatarText = conv.other_user.short_name;
        } else {
          avatarText = displayName.substring(0, 2).toUpperCase();
        }

        return {
          id: conv.id,
          name: displayName,
          message: conv.last_message || "",
          time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
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
        // For University view: role "university" -> "me", role "student" -> "them"
        sender: msg.sender_role === "university" ? "me" : "them",
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
        console.log("WebSocket Connected (University View)");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          const newMsg = {
            id: Date.now(),
            // For University view: role "university" -> "me", role "student" -> "them"
            sender: data.role === "university" ? "me" : "them",
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
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
        textareaRef.current.style.height = "40px";
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
    <div className=" bg-base p-6">
      {/* Left Sidebar - Conversation List */}
      <div className="flex h-[90vh] bg-white">
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Search Bar */}
            <h2 className="text-xl font-bold mb-4">Gestión de Chat</h2>


            {/* Conversation List */}
            <div className="space-y-1">
              {conversations?.map((conv) => (
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
                    {/* {conv.hasBlueIndicator && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue rounded-full"></div>
                    )} */}
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
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            // Empty State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DBEAFE] text-blue rounded-full mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-500 text-sm">
                  Elige una conversación de la lista para ver los mensajes
                  <br />
                  y responder a las consultas de los estudiantes
                </p>
              </div>
            </div>
          ) : (
            // Chat View
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
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
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {activeRoomMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`flex gap-2 max-w-md ${msg.sender === "me"
                          ? "flex-row-reverse"
                          : "flex-row"
                          }`}
                      >
                        {msg.sender === "them" && (
                          <div className="w-8 h-8 bg-sky rounded-full flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
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
    </div>
  );
}   