import { createActorContext } from "@xstate/react";
import React from "react";
import { CardGrid } from "./components/card-grid/CardGrid";
import { Map } from "./components/map/Map";
import { creteMainGameMachine } from "./xstate/main-game-machine";

export const MainGameMachineContext = createActorContext(creteMainGameMachine(), { devTools: true });

const App: React.FC = () => {
  return (
    <MainGameMachineContext.Provider>
      <AppBody />
    </MainGameMachineContext.Provider>
  );
};

const AppBody: React.FC = () => {
  return (
    <>
      <CardGrid></CardGrid>

      <Map />
    </>
  );
};

export default App;
