import { useMachine } from "@xstate/solid";
import { Component, For } from "solid-js";
import CardRow from "./CardRow";
import CharacterCard from "./CharacterCard";
import { EventName, StateName, mainGameMachine } from "./main-game-machine";

const App: Component = () => {
  const [state, send] = useMachine(mainGameMachine(), {
    devTools: true,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "10rem",
        }}
      >
        {state.value === StateName.addingPlayers && (
          <input
            type="text"
            placeholder="Add player"
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
        <For each={state.context.playerIds}>
          {(playerId) => (
            <CardRow>
              <For each={state.context.characters}>
                {(character) =>
                  character.owner === playerId ? (
                    <CharacterCard character={character} />
                  ) : null
                }
              </For>
            </CardRow>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
