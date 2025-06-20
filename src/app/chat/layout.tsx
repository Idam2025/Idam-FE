import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import styles from "./[id]/chatPage.module.css";
import Sidebar from "@/components/chat/Sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
