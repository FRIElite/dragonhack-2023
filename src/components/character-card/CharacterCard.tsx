import React, { useContext } from "react";
import { ElementType, elementTypeSchema } from "../../../api/enums/element-type.enum";
import { Character } from "../../../api/interfaces/character.interface";
import { MainGameMachineContext } from "../../App";
import { Loader } from "../Loader";
import "./CharacterCard.scss";

export const elementTypeEmoji: Record<ElementType, { emoji: string; color: string }> = {
  [elementTypeSchema.Enum.Normal]: { emoji: "🔶", color: "#BA8259" },
  [elementTypeSchema.Enum.Fire]: { emoji: "🔥", color: "#BA5959" },
  [elementTypeSchema.Enum.Water]: { emoji: "💧", color: "#5987BA" },
  [elementTypeSchema.Enum.Electric]: { emoji: "⚡️", color: "#BAB559" },
  [elementTypeSchema.Enum.Grass]: { emoji: "🍃", color: "#6DBA59" },
  [elementTypeSchema.Enum.Ice]: { emoji: "❄️", color: "#59BAA2" },
  [elementTypeSchema.Enum.Fighting]: { emoji: "👊", color: "#BAA059" },
  [elementTypeSchema.Enum.Poison]: { emoji: "🍄", color: "#BA6B59" },
  [elementTypeSchema.Enum.Ground]: { emoji: "🏔", color: "#BA8F59" },
  [elementTypeSchema.Enum.Flying]: { emoji: "💨", color: "white" },
  [elementTypeSchema.Enum.Psychic]: { emoji: "👁️", color: "#8359BA" },
  [elementTypeSchema.Enum.Bug]: { emoji: "🕸", color: "#97BA59" },
  [elementTypeSchema.Enum.Rock]: { emoji: "🗿", color: "#B5BAAD" },
  [elementTypeSchema.Enum.Ghost]: { emoji: "👻", color: "white" },
  [elementTypeSchema.Enum.Dragon]: { emoji: "🐲", color: "#B959BA" },
  [elementTypeSchema.Enum.Dark]: { emoji: "🌙", color: "#6E6E6E" },
  [elementTypeSchema.Enum.Steel]: { emoji: "⚙️", color: "#B0B0B0" },
  [elementTypeSchema.Enum.Fairy]: { emoji: "🌈", color: "#BA59A7" },
};

const elipsisText = (text: string) => (text.length < 100 ? text : text.substring(0, 100) + "...");

interface CharacterCardProps {
  character?: Character;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const defaultImageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png";

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  children,
  isLoading = false,
  disabled = false,
  onClick,
}) => {
  const [state, send] = useContext(MainGameMachineContext);

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
      data-active={state.context.effectSource === character.name}
      style={{ background: elementTypeEmoji[character.element].color }}
      onClick={onClick}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "500", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {character.name}
        </div>
        <div>{elementTypeEmoji[character.element].emoji}</div>
      </div>

      <img width="200" src={character.imageUrl} />

      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <div>{character.health} ❤️</div>
        <div>{character.shield} 🛡️</div>
        {character.receivingOvertimeDamage !== undefined && <div>{character.receivingOvertimeDamage} ⚔️</div>}
        {character.overtimeDamageTurnsRemaining !== undefined && <div>{character.overtimeDamageTurnsRemaining} 🕒</div>}
      </div>

      <div style={{ height: "100%", display: "flex", alignItems: "center", textAlign: "center" }}>
        {elipsisText(character.description)}
      </div>
    </div>
  );
};
