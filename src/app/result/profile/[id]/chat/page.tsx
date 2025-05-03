import style from "@/components/chat/chat.module.css";
import Image from "next/image";
export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <div className={style.fontSpace}>
          <div className={style.font1}>
            <Image
              src="/chatplace/ChatText.svg"
              alt="chatIcon"
              width={24}
              height={24}
            />{" "}
            Al Chat Tool Impact Writing
          </div>
          <div className={style.font1}>
            <Image
              src="/chatplace/ChatText.svg"
              alt="chatIcon"
              width={24}
              height={24}
            />{" "}
            New chat
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
              alt="sqaure"
              width={24}
              height={24}
            />
            Updates & FAQ
          </div>

          <div className={style.font1}>
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
    </div>
  );
}
