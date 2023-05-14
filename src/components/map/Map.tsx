import React, { useContext, useRef } from "react";
import { MainGameMachineContext } from "../../App";
import { EventName, StateName } from "../../xstate/main-game-machine";
import { CardGrid } from "../card-grid/CardGrid";
import { EffectCard } from "../effect-card/EffectCard";
import "./Map.scss";

interface MapProps {}

export const Map: React.FC<MapProps> = ({}) => {
  const [state, send] = useContext(MainGameMachineContext);

  console.log({ state });

  const player1Ref = useRef<HTMLInputElement>();
  const player2Ref = useRef<HTMLInputElement>();

  const players = React.useMemo(() => {
    const isAdding = state.value === StateName.addingPlayers;
    const playerIds = state.context.playerIds;

    return [
      {
        isAdding: isAdding && playerIds[0] === undefined,
        id: playerIds[0],
        winner:
          state.context.characters.length >= 6 &&
          state.context.characters.filter((c) => c.playerId === playerIds[1]).every((c) => c.health <= 0),
      },
      {
        isAdding: isAdding && playerIds[0] !== undefined && playerIds[1] === undefined,
        id: playerIds[1],
        winner:
          state.context.characters.length >= 6 &&
          state.context.characters.filter((c) => c.playerId === playerIds[0]).every((c) => c.health <= 0),
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

  React.useEffect(() => {
    if (players[0].isAdding) player1Ref.current?.focus();
    else if (players[1].isAdding) player2Ref.current?.focus();
  }, [players]);

  return (
    <div className="map">
      <div className="player">
        <div data-active={players[0].isAdding}>
          {players[0].isAdding ? (
            <input ref={player1Ref as any} type="text" placeholder="Input name..." onKeyDown={handleAddPlayer} />
          ) : (
            players[0].id
          )}
        </div>
      </div>

      <div>
        <CardGrid />
      </div>

      <div className="player">
        <div data-active={players[1].isAdding}>
          {players[1].isAdding ? (
            <input ref={player2Ref as any} type="text" placeholder="Input name..." onKeyDown={handleAddPlayer} />
          ) : (
            players[1].id
          )}
        </div>
      </div>

      <div className="effect-card-box">
        <EffectCard
          disabled={
            state.value !== StateName.effectGeneration &&
            state.value !== StateName.loadingEffect &&
            !state.context.currentEffect
          }
          isLoading={state.value === StateName.loadingEffect}
          effect={state.context.currentEffect}
        >
          <input
            type="text"
            placeholder="Input effect..."
            disabled={state.value === StateName.loadingEffect}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.currentTarget.value) {
                send({
                  type: EventName.GENERATE_EFFECT,
                  prompt: event.currentTarget.value,
                });
                event.currentTarget.value = "";
              }
            }}
          />
        </EffectCard>
      </div>

      {state.context.currentPlayerId && (
        <div className="current-player-box">{state.context.currentPlayerId}'s turn</div>
      )}

      {(players[0].winner || players[1].winner) && (
        <div className="winner-box">{players[0].winner ? players[0].id : players[1].id} WON!</div>
      )}

      {(players[0].isAdding || players[1].isAdding) && <div className="overlay" />}
    </div>
  );
};
