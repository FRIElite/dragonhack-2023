import { Character } from "../../api/interfaces/character.interface";

export default function CharacterCard({ character }: { character: Character }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "10px",
        boxShadow: "0 0 20px 2px rgba(0,0,0,0.25)",
        padding: "10px",
        aspectRatio: "2/3",
      }}
    >
      <img
        width="200"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
      />
      <span>Name: {character.name}</span>
      <span>Health: {character.health}</span>
    </div>
  );
}
