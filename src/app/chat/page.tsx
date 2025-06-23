"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/chat/chat.module.css";
import { useChatSocket } from "@/stores/useChatSocket";
import { FaCog, FaTrash } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

interface ChatRoom {
  id: number;
  avatar: string;
  name: string;
  project: string;
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<Client | null>(null);

  const myUserId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("userId")) ?? 0
      : 0;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ?? ""
      : "";

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatRooms = async () => {
    const userType = localStorage.getItem("userType");
    const endpoint =
      userType === "STUDENT"
        ? "/api/chat/rooms/student"
        : "/api/chat/rooms/company";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "채팅 목록 조회 실패");

      const rooms = await Promise.all(
        data.map(async (room: any) => {
          const messageRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${room.roomId}/messages`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const messages = await messageRes.json();
          const lastMessage = messages.at(-1);

          return {
            id: room.roomId,
            name: room.opponentName,
            project: room.projectTitle,
            avatar: room.opponentProfileImage,
            lastMessage,
            unreadCount: room.unreadCount,
          };
        })
      );

      setChatRooms(rooms);
    } catch (error) {
      console.error("❌ 채팅 목록 조회 오류:", error);
    }
  };

  const handleSelectChat = (chat: ChatRoom) => {
    setSelectedChat(chat);
    setMessages([]);

    if (clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat/read",
        body: JSON.stringify({ roomId: chat.id }),
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      clientRef.current.subscribe(
        `/sub/chat/read/${chat.id}/${myUserId}`,
        (message) => {
          if (message.body === "read") {
            console.log("📖 상대방이 내 메시지를 읽었음");

            // 1. 메시지 목록 중 내가 보낸 read: false인 것만 true로 변경
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === myUserId && !msg.read
                  ? { ...msg, read: true }
                  : msg
              )
            );

            // 2. chatRooms 목록에서도 lastMessage가 내 메시지였다면 읽힘 처리
            setChatRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === selectedChat?.id &&
                room.lastMessage?.senderId === myUserId &&
                !room.lastMessage.read
                  ? {
                      ...room,
                      lastMessage: {
                        ...room.lastMessage,
                        read: true,
                      },
                      unreadCount: 0,
                    }
                  : room
              )
            );
          }
        }
      );
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleDeleteRoom = async (roomId: number) => {
    const userType = localStorage.getItem("userType");
    const endpoint =
      userType === "STUDENT"
        ? `/api/chat/room/${roomId}/student`
        : `/api/chat/room/${roomId}/company`;

    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("채팅방 삭제 실패");

      setChatRooms((prev) => prev.filter((room) => room.id !== roomId));
      if (selectedChat?.id === roomId) setSelectedChat(null);
    } catch (error) {
      console.error("❌ 채팅방 삭제 오류:", error);
    }
  };

  const { sendMessage } = useChatSocket(
    selectedChat
      ? {
          roomId: selectedChat.id,
          token: accessToken,
          onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);

            setChatRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === selectedChat?.id
                  ? { ...room, lastMessage: msg, unreadCount: 0 }
                  : room
              )
            );
          },
          onConnect: () => console.log("🟢 웹소켓 연결 완료!"),
        }
      : ({ roomId: -1, token: "", onMessage: () => {} } as any)
  );

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !selectedChat) return;

    sendMessage({
      roomId: selectedChat.id,
      senderId: myUserId,
      content: trimmed,
    });

    setInput("");
    setTimeout(fetchChatRooms, 500);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${selectedChat.id}/messages`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws/chat?token=${accessToken}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        console.log("📡 WebSocket 연결됨");
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <Image
          src="/usual/resized_image.png"
          alt="background"
          fill
          priority
          style={{ objectFit: "cover", opacity: 0.9 }}
        />
      </div>

      <div className={styles.chatContainer}>
        <motion.div className={styles.chatListBox}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>채팅 목록</h2>
            <FaCog
              className={styles.settingsIconGlobal}
              onClick={() => setShowDeleteIcons((prev) => !prev)}
            />
          </div>

          {chatRooms.map((chat) => (
            <motion.div
              key={chat.id}
              className={`${styles.chatItem} ${
                showDeleteIcons ? styles.showDelete : ""
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {showDeleteIcons && (
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteRoom(chat.id)}
                />
              )}
              <div className={styles.chatItemRow}>
                <div
                  className={styles.chatItemContent}
                  onClick={() => handleSelectChat(chat)}
                >
                  <Image
                    src={
                      chat.avatar?.trim() ? chat.avatar : "/profile/default.png"
                    }
                    alt={chat.name}
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                  <div className={styles.chatTextGroup}>
                    <div className={styles.row1}>
                      <div className={styles.projectTitle}>
                        {chat.project} | {chat.name}
                      </div>
                      <div className={styles.lastTime}>
                        {chat.lastMessage?.sentAt &&
                          new Date(chat.lastMessage.sentAt).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </div>
                    </div>
                    <div className={styles.row2}>
                      <div className={styles.lastMessage}>
                        {chat.lastMessage?.content ?? ""}
                      </div>
                      {(chat.unreadCount ?? 0) > 0 && (
                        <div className={styles.unreadBadge}>
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          key={selectedChat?.id || "empty"}
          className={styles.chatViewBox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {selectedChat ? (
            <>
              <div className={styles.chatHeader}>
                <Image
                  src={
                    selectedChat.avatar?.trim()
                      ? selectedChat.avatar
                      : "/profile/default.png"
                  }
                  alt={selectedChat.name}
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
                <span className={styles.name}>
                  {selectedChat.project} | {selectedChat.name}
                </span>
              </div>

              <div className={styles.chatMessages}>
                {messages.map((msg) => {
                  const isMine = msg.senderId === myUserId;
                  return (
                    <div
                      key={msg.messageId}
                      className={
                        isMine
                          ? styles.myMessageWrapper
                          : styles.theirMessageWrapper
                      }
                    >
                      {isMine ? (
                        <>
                          <div className={styles.messageMeta}>
                            <span className={styles.readStatus}>
                              {msg.senderId === myUserId && !msg.read
                                ? "1"
                                : ""}
                            </span>
                            <span className={styles.timestamp}>
                              {new Date(msg.sentAt).toLocaleTimeString(
                                "ko-KR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <div className={styles.myMessage}>{msg.content}</div>
                        </>
                      ) : (
                        <>
                          <div className={styles.theirMessage}>
                            {msg.content}
                          </div>
                          <div className={styles.messageMeta}>
                            <span className={styles.timestamp}>
                              {new Date(msg.sentAt).toLocaleTimeString(
                                "ko-KR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className={styles.chatInputBar}>
                <input
                  className={styles.chatInput}
                  placeholder="메시지를 입력하세요"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button className={styles.sendBtn} onClick={handleSendMessage}>
                  전송
                </button>
              </div>
            </>
          ) : (
            <div className={styles.chatPlaceholder}></div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
