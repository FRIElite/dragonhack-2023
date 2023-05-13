import { JSX } from "solid-js/jsx-runtime";

export default function CardRow({ children }: { children: JSX.Element }) {
  return <div style={{ display: "flex", gap: "2rem" }}>{children}</div>;
}
