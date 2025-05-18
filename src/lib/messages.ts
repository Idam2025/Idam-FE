export type ChatMessage = {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: number;
};

export const initialMessages: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "other",
      content: "Hi Alice!",
      timestamp: Date.now() - 600000, // 10분 전
    },
    {
      id: 2,
      sender: "me",
      content: "Hello!",
      timestamp: Date.now() - 300000, // 5분 전
    },
  ],
  2: [
    {
      id: 1,
      sender: "me",
      content: "Hey Bob!",
      timestamp: Date.now() - 100000,
    },
  ],
  3: [],
  4: [],
  5: [],
};
