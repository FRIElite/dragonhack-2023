import { useMachine } from "@xstate/react";
import React, { createContext, useEffect } from "react";
import { CardGrid } from "./components/card-grid/CardGrid";
import { Map } from "./components/map/Map";
import { EventName, creteMainGameMachine } from "./xstate/main-game-machine";

export const MainGameMachineContext = createContext<
  ReturnType<typeof useMachine<ReturnType<typeof creteMainGameMachine>>>
>([] as any);

const mainGameMachine = creteMainGameMachine();

const App: React.FC = () => {
  const [state, send, interpreter] = useMachine(mainGameMachine, { devTools: true });

  useEffect(() => {
    interpreter.onEvent((event) => {
      if (event.type === EventName.SET_EFFECT_TARGET) {
        console.log(event);
      }
    });
  }, []);

  return (
    <MainGameMachineContext.Provider value={[state, send, interpreter]}>
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
