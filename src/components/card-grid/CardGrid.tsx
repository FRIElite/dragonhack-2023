import { useContext } from "react";
import { MainGameMachineContext } from "../../App";
import { EventName, StateName } from "../../xstate/main-game-machine";
import { CharacterCard } from "../character-card/CharacterCard";
import { EffectCard } from "../effect-card/EffectCard";
import "./CardGrid.scss";

export const CardGrid = () => {
  const [state, send] = useContext(MainGameMachineContext);

  return (
    <div className="grid">
      {state.context.characters.map((character, i) => (
        <CharacterCard
          character={character}
          key={`character-${i}`}
          disabled={
            (state.value === StateName.settingEffectSource && character.playerId !== state.context.currentPlayerId) ||
            state.value === StateName.loadingEffect ||
            character.health <= 0
          }
          onClick={() => {
            if (state.value === StateName.settingEffectSource && character.playerId === state.context.currentPlayerId) {
              send({
                type: EventName.SET_EFFECT_SOURCE,
                source: character.name,
              });
            } else if (state.value === StateName.settingEffectTarget) {
              send({
                type: EventName.SET_EFFECT_TARGET,
                target: character.name,
                element: state.context.currentEffect?.element,
              });
            }
          }}
        />
      ))}

      {state.value === StateName.loadingCharacter && <CharacterCard isLoading={true} />}

      {((state.value === StateName.characterGeneration && state.context.characters.length < 6) ||
        (state.value === StateName.loadingCharacter && state.context.characters.length < 5)) && (
        <CharacterCard>
          <input
            type="text"
            placeholder="Generate character"
            disabled={state.value === StateName.loadingCharacter}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.currentTarget.value) {
                send({
                  type: EventName.GENERATE_CHARACTER,
                  prompt: event.currentTarget.value,
                });
                event.currentTarget.value = "";
              }
            }}
            autoFocus
          />
        </CharacterCard>
      )}

      <div className="generate-effect-row">
        {(state.value === StateName.effectGeneration || state.value === StateName.loadingEffect) && (
          <input
            type="text"
            placeholder="Generate effect"
            disabled={state.value === StateName.loadingEffect}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.currentTarget.value) {
                send({
                  type: EventName.GENERATE_EFFECT,
                  prompt: event.currentTarget.value,
                });
                event.currentTarget.value = "";
              }
            }}
          />
        )}
      </div>

      <div className="effect-card-container">
        {state.context.currentEffect && <EffectCard effect={state.context.currentEffect} />}
      </div>

      <div className="current-player-container">{state.context.currentPlayerId}</div>
    </div>
  );
};
