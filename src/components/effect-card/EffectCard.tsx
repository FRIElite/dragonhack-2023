import React from "react";
import { Effect } from "../../../api/interfaces/effect.inerface";
import "./EffectCard.scss";

interface EffectCardProps {
  effect: Effect;
}

export const EffectCard: React.FC<EffectCardProps> = ({ effect }) => {
  return (
    <div className="effect-card">
      <span>Name: {effect.name}</span>
      <span>Element: {effect.element}</span>
      <span>Description: {effect.description}</span>
      <span>Type: {effect.type}</span>
    </div>
  );
};
