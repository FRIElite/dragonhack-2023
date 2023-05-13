import { createActorContext } from "@xstate/react";
import React from "react";
import { CardRow } from "./components/CardRow";
import CharacterCard from "./components/CharacterCard";
import { CreatePlayers } from "./components/CreatePlayers";
import { EventName, StateName, mainGameMachine } from "./xstate/main-game-machine";

export const AppMachineContext = createActorContext(mainGameMachine);

const App: React.FC = () => {
  return (
    <AppMachineContext.Provider>
      <AppBody />
    </AppMachineContext.Provider>
  );
};

const AppBody: React.FC = () => {
  const [state, send] = AppMachineContext.useActor();

  React.useEffect(() => {
    console.log(state.context);
  }, [state]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10rem",
        }}
      >
        {state.value === StateName.addingPlayers && <CreatePlayers />}
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
        {state.context.playerIds.map((playerId, playerIndex) => (
          <CardRow key={`player-${playerIndex}`}>
            {state.context.characters.map((character, i) => (
              <React.Fragment key={`character-${i}`}>
                {character.owner === playerId && <CharacterCard character={character} />}
              </React.Fragment>
            ))}
          </CardRow>
        ))}
      </div>
    </>
  );
};

export default App;
