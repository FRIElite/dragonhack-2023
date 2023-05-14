import React from "react";
import { AppMachineContext } from "../App";
import { EventName } from "../xstate/main-game-machine";

interface CreatePlayersProps {}

export const CreatePlayers: React.FC<CreatePlayersProps> = ({}) => {
  const [state, send] = AppMachineContext.useActor();

  return (
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
  );
};
