import React from "react";
import { EffectType } from "../../../api/enums/effect-type.enum";
import { Effect } from "../../../api/interfaces/effect.inerface";
import { Loader } from "../Loader";
import { elementTypeEmoji } from "../character-card/CharacterCard";
import "./EffectCard.scss";

interface EffectCardProps {
  disabled?: boolean;
  effect?: Effect | null;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const EffectCard: React.FC<EffectCardProps> = ({ effect, isLoading, children, disabled }) => {
  if (disabled) return <div />;

  if (isLoading || !effect) {
    return (
      <div className={`effect-card`} style={{ justifyContent: "center" }}>
        {!isLoading && children}

        {isLoading && <Loader />}
      </div>
    );
  }

  return (
    <div className="effect-card" style={{ background: elementTypeEmoji[effect.element].color }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "500" }}>{effect.name}</div>
        <div>{elementTypeEmoji[effect.element].emoji}</div>
      </div>

      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        {effect.type === EffectType.Defense ? (
          `${effect.shield} 🛡️`
        ) : effect.type === EffectType.Offense ? (
          `${effect.damage} ⚔️`
        ) : (
          <>
            <div>{effect.damage} ⚔️</div>
            <div>{effect.rounds} 🕒</div>
          </>
        )}
      </div>

      <div style={{ height: "100%", display: "flex", alignItems: "center", textAlign: "center", marginTop: 8 }}>
        {effect.description}
      </div>
    </div>
  );
};
