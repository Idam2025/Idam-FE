"use client";

import styles from "@/components/chat/chat.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dummyChats = [
  {
    id: 1,
    name: "Alice",
    lastMessage: "See you tomorrow!",
    avatar: "/profile/default.png",
  },
  {
    id: 2,
    name: "Bob",
    lastMessage: "Can you send me the file?",
    avatar: "/profile/default.png",
  },
  {
    id: 3,
    name: "Charlie",
    lastMessage: "Let's meet at 5pm.",
    avatar: "/profile/default.png",
  },
  {
    id: 4,
    name: "Diana",
    lastMessage: "Got it, thanks!",
    avatar: "/profile/default.png",
  },
  {
    id: 5,
    name: "Ethan",
    lastMessage: "Let me know if you're free.",
    avatar: "/profile/default.png",
  },
];

type SidebarProps = {
  onSelectChat: (id: number) => void;
};

function Sidebar({ onSelectChat }: SidebarProps) {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <div className={styles.fontSpace}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
        <div className={styles.chatList}>
          {dummyChats.map((chat) => (
            <div
              key={chat.id}
              className={styles.chatItemBox}
              onClick={() => onSelectChat(chat.id)}
            >
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={36}
                height={36}
                className={styles.chatAvatarRounded}
              />
              <div className={styles.chatTextBright}>
                <div className={styles.chatName}>{chat.name}</div>
                <div className={styles.chatLast}>{chat.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.lowfontSpace}>
        {[
          { icon: "Trash", text: "Clear conversations" },
          { icon: "Sun", text: "Light mode" },
          { icon: "User", text: "My account" },
          { icon: "ArrowSquareOut", text: "Updates & FAQ" },
          { icon: "SignOut", text: "Home", onClick: () => router.push("/") },
        ].map(({ icon, text, onClick }) => (
          <div key={text} className={styles.font1} onClick={onClick}>
            <Image
              src={`/chatplace/${icon}.svg`}
              alt={text}
              width={24}
              height={24}
            />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChatView() {
  return (
    <div className={styles.container_right}>
      <div className={styles.container_right_up}></div>
      <div className={styles.chatPlace}>
        <Image src="/usual/logo.svg" alt="로고" width={61} height={57} />
        <div className={styles.comment}>
          {["Chats", "Star", "ShieldWarning"].map((icon, i) => (
            <div className={styles.frame} key={icon + i}>
              <div className={styles.top}>
                <Image
                  src={`/chatplace/${icon}.svg`}
                  alt={icon}
                  width={32}
                  height={32}
                />
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.fontFrame}>
                    "Got any creative ideas for a 10 year old's birthday?"
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chatBarPlace}>
        <div className={styles.chatBar}>
          <Image
            src="/chatplace/Image.svg"
            alt="image"
            width={20}
            height={20}
          />
          <input placeholder="message" className={styles.darkInput} />
        </div>
      </div>
    </div>
  );
}

function ChatView({ chat }: { chat: (typeof dummyChats)[number] }) {
  return (
    <div className={styles.container_right}>
      <div className={styles.container_right_up}>
        <h3 style={{ color: "#fff" }}>{chat.name}</h3>
      </div>
      <div className={styles.chatPlace}>
        <div className={styles.comment}>
          <div className={styles.frame}>
            <div className={styles.top}>
              <div className={styles.fontFrame}>Hi, how are you?</div>
              <div className={styles.fontFrame}>Can we talk today?</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.chatBarPlace}>
        <div className={styles.chatBar}>
          <Image
            src="/chatplace/Image.svg"
            alt="image"
            width={20}
            height={20}
          />
          <input placeholder="Type a message..." className={styles.darkInput} />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      {selectedChatId ? (
        <ChatView chat={dummyChats.find((c) => c.id === selectedChatId)!} />
      ) : (
        <EmptyChatView />
      )}
    </div>
  );
}
