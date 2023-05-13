import { createActorContext } from "@xstate/react";
import React from "react";
import { CardGrid } from "./components/CardGrid";
import { CreatePlayers } from "./components/CreatePlayers";
import { StateName, mainGameMachine } from "./xstate/main-game-machine";

export const AppMachineContext = createActorContext(mainGameMachine, { devTools: true });

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

        <CardGrid></CardGrid>
      </div>
    </>
  );
};

export default App;
