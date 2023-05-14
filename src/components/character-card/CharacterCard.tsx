import React from "react";
import { ElementType } from "../../../api/enums/element-type.enum";
import { Character } from "../../../api/interfaces/character.interface";
import { Loader } from "../Loader";
import "./CharacterCard.scss";

export const elementTypeEmoji: Record<ElementType, { emoji: string; color: string }> = {
  [ElementType.Normal]: { emoji: "🔶", color: "#BA8259" },
  [ElementType.Fire]: { emoji: "🔥", color: "#BA5959" },
  [ElementType.Water]: { emoji: "💧", color: "#5987BA" },
  [ElementType.Electric]: { emoji: "⚡️", color: "#BAB559" },
  [ElementType.Grass]: { emoji: "🍃", color: "#6DBA59" },
  [ElementType.Ice]: { emoji: "❄️", color: "#59BAA2" },
  [ElementType.Fighting]: { emoji: "👊", color: "#BAA059" },
  [ElementType.Poison]: { emoji: "🍄", color: "#BA6B59" },
  [ElementType.Ground]: { emoji: "🏔", color: "#BA8F59" },
  [ElementType.Flying]: { emoji: "💨", color: "white" },
  [ElementType.Psychic]: { emoji: "👁️", color: "#8359BA" },
  [ElementType.Bug]: { emoji: "🕸", color: "#97BA59" },
  [ElementType.Rock]: { emoji: "🗿", color: "#B5BAAD" },
  [ElementType.Ghost]: { emoji: "👻", color: "white" },
  [ElementType.Dragon]: { emoji: "🐲", color: "#B959BA" },
  [ElementType.Dark]: { emoji: "🌙", color: "#6E6E6E" },
  [ElementType.Steel]: { emoji: "⚙️", color: "#B0B0B0" },
  [ElementType.Fairy]: { emoji: "🌈", color: "#BA59A7" },
};

const elipsisText = (text: string) => (text.length < 100 ? text : text.substring(0, 100) + "...");

interface CharacterCardProps {
  character?: Character;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const defaultImageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png";

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  children,
  isLoading = false,
  disabled = false,
  onClick,
}) => {
  if (isLoading || !character) {
    return (
      <div
        className={`character-card ${disabled ? "disabled" : ""}`}
        style={{ justifyContent: "center" }}
        onClick={onClick}
      >
        {!isLoading && children}

        {isLoading && <Loader />}
      </div>
    );
  }

  return (
    <div
      className={`character-card ${disabled ? "disabled" : ""} gradient-border`}
      style={{ background: elementTypeEmoji[character.element].color }}
      onClick={onClick}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "500" }}>{character.name}</div>
        <div>{elementTypeEmoji[character.element].emoji}</div>
      </div>

      <img width="200" src={character.imageUrl} />

      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <div>{character.health} ❤️</div>
        <div>{character.health} 🛡️</div>
      </div>

      <div style={{ height: "100%", display: "flex", alignItems: "center", textAlign: "center" }}>
        {elipsisText(character.description)}
      </div>
    </div>
  );
};
