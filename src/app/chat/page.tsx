"use client";
import style from "@/components/chat/chat.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dummyChats = [
  {
    id: 1,
    name: "Alice",
    lastMessage: "See you tomorrow!",
    avatar: "/default-profile.png",
  },
  {
    id: 2,
    name: "Bob",
    lastMessage: "Can you send me the file?",
    avatar: "/default-profile.png",
  },
  {
    id: 3,
    name: "Charlie",
    lastMessage: "Let's meet at 5pm.",
    avatar: "/default-profile.png",
  },
  {
    id: 4,
    name: "Diana",
    lastMessage: "Got it, thanks!",
    avatar: "/default-profile.png",
  },
  {
    id: 5,
    name: "Ethan",
    lastMessage: "Let me know if you're free.",
    avatar: "/default-profile.png",
  },
];

export default function Page() {
  const router = useRouter();
  const moveHome = () => {
    router.push("/");
  };

  const goToChat = (chatId: any) => {
    router.push(`/chat/${chatId}`);
  };

  const SideBar = () => {
    return (
      <div className={style.sidebar}>
        <div className={style.fontSpace}>
          <input
            type="text"
            placeholder="Search..."
            className={style.searchInput}
          />

          <div className={style.chatList}>
            {dummyChats.map((chat) => (
              <div
                key={chat.id}
                className={style.chatItemBox}
                onClick={() => goToChat(chat.id)}
              >
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={36}
                  height={36}
                  className={style.chatAvatarRounded}
                />
                <div className={style.chatTextBright}>
                  <div className={style.chatName}>{chat.name}</div>
                  <div className={style.chatLast}>{chat.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={style.lowfontSpace}>
          <div className={style.font1}>
            <Image
              src="/chatplace/Trash.svg"
              alt="trash"
              width={24}
              height={24}
            />
            Clear conversations
          </div>

          <div className={style.font1}>
            <Image
              src="/chatplace/Sun.svg"
              alt="light mode"
              width={24}
              height={24}
            />
            Light mode
          </div>

          <div className={style.font1}>
            <Image
              src="/chatplace/User.svg"
              alt="user"
              width={24}
              height={24}
            />
            My account
          </div>

          <div className={style.font1}>
            <Image
              src="/chatplace/ArrowSquareOut.svg"
              alt="square"
              width={24}
              height={24}
            />
            Updates & FAQ
          </div>

          <div onClick={moveHome} className={style.font1}>
            <Image
              src="/chatplace/SignOut.svg"
              alt="home"
              width={24}
              height={24}
            />
            Home
          </div>
        </div>
      </div>
    );
  };

  const Right = () => {
    return (
      <div className={style.container_right}>
        <div className={style.container_right_up}></div>
        <div className={style.chatPlace}>
          <Image src="/usual/logo.svg" alt="로고" width={61} height={57} />
          <div className={style.comment}>
            <div className={style.frame}>
              <div className={style.top}>
                <Image
                  src="/chatplace/Chats.svg"
                  alt="chat"
                  width={32}
                  height={32}
                />
                <div className={style.fontFrame}>
                  "Explain quantum computing in simple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
              </div>
            </div>

            <div className={style.frame}>
              <div className={style.top}>
                <Image
                  src="/chatplace/Star.svg"
                  alt="AI"
                  width={32}
                  height={32}
                />
                <div className={style.fontFrame}>
                  "Explain quantum computing in simple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
              </div>
            </div>

            <div className={style.frame}>
              <div className={style.top}>
                <Image
                  src="/chatplace/ShieldWarning.svg"
                  alt="AI"
                  width={32}
                  height={32}
                />
                <div className={style.fontFrame}>
                  "Explain quantum computing in simple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10 year old's birthday?"
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.chatBarPlace}>
          <div className={style.chatBar}>
            <Image
              src="/chatplace/Image.svg"
              alt="image"
              width={20}
              height={20}
            />
            <input placeholder="message" className={style.darkInput}></input>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={style.container}>
      <SideBar />
      <Right />
    </div>
  );
}
