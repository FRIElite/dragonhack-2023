import { AppMachineContext } from "../App";
import { EventName, StateName } from "../xstate/main-game-machine";
import CharacterCard from "./CharacterCard";

export const CardGrid = () => {
  const [state, send] = AppMachineContext.useActor();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
      }}
    >
      {state.context.characters.map((character) => (
        <CharacterCard character={character} />
      ))}

      {state.value === StateName.loadingCharacter && <CharacterCard isLoading={true} />}

      {((state.value === StateName.characterGeneration && state.context.characters.length < 6) ||
        (state.value === StateName.loadingCharacter && state.context.characters.length < 5)) && (
        <CharacterCard>
          <input
            type="text"
            placeholder="Generate character"
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.currentTarget.value) {
                send({
                  type: EventName.GENERATE_CHARACTER,
                  name: event.currentTarget.value,
                });
                event.currentTarget.value = "";
              }
            }}
          />
        </CharacterCard>
      )}
    </div>
  );
};
