import style from "@/components/chat/chat.module.css";
import Image from "next/image";
export default function Page() {
  const SideBar = () => {
    return (
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
                  "Explain quantum computing insimple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
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
                  "Explain quantum computing insimple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
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
                  "Explain quantum computing insimple terms"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
                </div>
                <div className={style.fontFrame}>
                  "Got any creative ideas for a 10year old's birthday?"
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
