interface CardRowProps {
  children: React.ReactNode;
}

export const CardRow: React.FC<CardRowProps> = ({ children }) => {
  return <div style={{ display: "flex", gap: "2rem" }}>{children}</div>;
};
