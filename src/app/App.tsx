import type { ReactNode } from "react";

export default function App({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-gray-200">{children}</div>;
}
