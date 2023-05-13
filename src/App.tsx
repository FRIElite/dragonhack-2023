import { useMachine } from "@xstate/react";
import React from "react";
import CardRow from "./components/CardRow";
import CharacterCard from "./components/CharacterCard";
import { EventName, StateName, mainGameMachine } from "./xstate/main-game-machine";

const App: React.FC = () => {
  const [state, send] = useMachine(mainGameMachine(), {
    devTools: true,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10rem",
        }}
      >
        {state.value === StateName.addingPlayers && (
          <input
            type="text"
            placeholder="Add players"
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.currentTarget.value) {
                send({
                  type: EventName.ADD_PLAYER,
                  name: event.currentTarget.value,
                });
                event.currentTarget.value = "";
              }
            }}
          />
        )}
        {state.value === StateName.characterGeneration && (
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
        )}
        {state.context.playerIds.map((playerId) => (
          <CardRow>
            {state.context.characters.map((character) =>
              character.owner === playerId ? <CharacterCard character={character} /> : null
            )}
          </CardRow>
        ))}
      </div>
    </>
  );
};

export default App;
