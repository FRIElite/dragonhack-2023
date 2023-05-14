import { useContext } from "react";
import { MainGameMachineContext } from "../../App";
import { EventName, StateName } from "../../xstate/main-game-machine";
import { CharacterCard } from "../character-card/CharacterCard";
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
            placeholder="Input character..."
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
    </div>
  );
};
