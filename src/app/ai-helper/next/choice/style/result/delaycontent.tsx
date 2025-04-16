// delaycontent.tsx
"use client";

export default function DelayedContent() {
  // ❗ simulate Suspense-compatible delay
  throw new Promise((resolve) => setTimeout(resolve, 3000)); // suspense fallback 작동

  // 아래 코드는 3초 후 자동으로 렌더링됨
  return <div>✨ 3초 뒤 등장하는 콘텐츠</div>;
}
