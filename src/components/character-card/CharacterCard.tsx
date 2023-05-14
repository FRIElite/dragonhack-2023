import React from "react";
import { Character } from "../../../api/interfaces/character.interface";
import "./CharacterCard.scss";

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
  return (
    <div className={`character-card ${disabled ? "disabled" : ""}`} onClick={onClick}>
      <img width="200" src={character?.imageUrl || defaultImageUrl} />

      {children}

      {isLoading && "Loading"}

      {character && (
        <>
          <span>Name: {character.name}</span>
          <span>Health: {character.health}</span>
          <span>Element: {character.element}</span>
          <span>Description: {character.description}</span>
        </>
      )}
    </div>
  );
};
