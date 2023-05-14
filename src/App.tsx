import { useMachine } from "@xstate/react";
import React, { createContext, useEffect } from "react";
import { ElementType } from "../api/enums/element-type.enum";
import { elementTypeEmoji } from "./components/character-card/CharacterCard";
import { Map } from "./components/map/Map";
import { Confetti } from "./utils/confetti";
import { playSound } from "./utils/playSound";
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
        const element: ElementType | undefined = (event as any).element;
        if (!element) return;
        console.log(event);
        Confetti.onEffect(elementTypeEmoji[element]?.emoji);
        playSound(element);
      }
    });

    interpreter.onDone(() => {
      Confetti.onDone();
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
      <Map />
    </>
  );
};

export default App;
