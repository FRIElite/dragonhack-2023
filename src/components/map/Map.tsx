import React from "react";
import { MainGameMachineContext } from "../../App";
import { EventName, StateName } from "../../xstate/main-game-machine";
import "./Map.scss";

interface MapProps {}

export const Map: React.FC<MapProps> = ({}) => {
  const [state, send] = MainGameMachineContext.useActor();

  const players = React.useMemo(() => {
    const isAdding = state.value === StateName.addingPlayers;
    const playerIds = state.context.playerIds;

    return [
      {
        isAdding: isAdding && playerIds[0] === undefined,
        id: playerIds[0],
      },
      {
        isAdding: isAdding && playerIds[0] !== undefined && playerIds[1] === undefined,
        id: playerIds[1],
      },
    ];
  }, [state]);

  const handleAddPlayer = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value) {
      send({
        type: EventName.ADD_PLAYER,
        name: event.currentTarget.value,
      });
    }
  };

  return (
    <div className="map">
      <div className="player">
        <div>
          {players[0].isAdding ? (
            <input type="text" placeholder="Input name" onKeyDown={handleAddPlayer} />
          ) : (
            players[0].id
          )}
        </div>
      </div>
      <div className="player">
        <div>
          {players[1].isAdding ? (
            <input type="text" placeholder="Input name" onKeyDown={handleAddPlayer} />
          ) : (
            players[1].id
          )}
        </div>
      </div>
    </div>
  );
};
