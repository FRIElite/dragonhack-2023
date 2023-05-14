import { assign, createMachine } from "xstate";
import { Character } from "../../api/interfaces/character.interface";
import { Effect } from "../../api/interfaces/effect.inerface";
import { generateCharacter, generateEffect } from "../api/api";

export enum StateName {
  addingPlayers = "addingPlayers",
  characterGeneration = "characterGeneration",
  loadingCharacter = "loadingCharacter",
  effectGeneration = "effectGeneration",
  loadingEffect = "loadingEffect",
  settingEffectSource = "settingEffectSource",
  settingEffectTarget = "settingEffectTarget",
  end = "end",
}

export enum EventName {
  ADD_PLAYER = "ADD_PLAYER",
  GENERATE_CHARACTER = "GENERATE_CHARACTER",
  GENERATE_EFFECT = "GENERATE_EFFECT",
  SET_EFFECT_SOURCE = "SET_EFFECT_SOURCE",
  SET_EFFECT_TARGET = "SET_EFFECT_TARGET",
}

export interface MainGameMachineContext {
  playerIds: string[];
  characters: Character[];
  currentPlayerId: string | null;
  currentEffect: Effect | null;
  effectSource: string | null;
}

const changeCurrentPlayer = assign((context: MainGameMachineContext) => ({
  currentPlayerId:
    context.playerIds[
      (context.playerIds.findIndex((val) => val === context.currentPlayerId) + 1) % context.playerIds.length
    ],
}));

export const creteMainGameMachine = ({ MAX_PLAYERS = 2, MAX_CHARACTERS = 3 } = {}) =>
  createMachine<MainGameMachineContext>({
    id: "main",
    initial: StateName.addingPlayers,
    predictableActionArguments: true,
    context: {
      playerIds: [],
      characters: [],
      currentPlayerId: null,
      currentEffect: null,
      effectSource: null,
    },
    states: {
      [StateName.addingPlayers]: {
        on: {
          [EventName.ADD_PLAYER]: {
            target: StateName.addingPlayers,
            actions: assign((context, event) => ({
              playerIds: [...new Set([...context.playerIds, event.name])],
              currentPlayerId: context.playerIds[0] || event.name || null,
            })),
          },
        },
        always: [
          {
            target: StateName.characterGeneration,
            cond: (context) => context.playerIds.length >= MAX_PLAYERS,
          },
        ],
      },
      [StateName.characterGeneration]: {
        on: {
          [EventName.GENERATE_CHARACTER]: {
            target: StateName.loadingCharacter,
          },
        },
        always: [
          {
            target: StateName.effectGeneration,
            cond: (context) =>
              context.playerIds.every(
                (playerId) => context.characters.filter((c) => c.playerId === playerId).length === MAX_CHARACTERS
              ),
          },
        ],
      },
      [StateName.loadingCharacter]: {
        invoke: {
          id: "fetchCharacter",
          src: (context, event) => generateCharacter(event.prompt),
          onDone: {
            target: StateName.characterGeneration,
            actions: [
              assign((context, event) =>
                context.currentPlayerId
                  ? {
                      characters: [
                        ...context.characters,
                        {
                          ...event.data,
                          playerId: context.currentPlayerId,
                        },
                      ],
                    }
                  : context
              ),
              changeCurrentPlayer,
            ],
          },
          onError: {
            target: StateName.characterGeneration,
          },
        },
      },
      [StateName.effectGeneration]: {
        on: {
          [EventName.GENERATE_EFFECT]: {
            target: StateName.loadingEffect,
          },
        },
        always: [
          {
            target: StateName.end,
            cond: (context) =>
              context.characters.filter((c) => c.playerId === context.currentPlayerId).every((c) => c.health <= 0),
          },
        ],
      },
      [StateName.loadingEffect]: {
        invoke: {
          id: "fetchEffect",
          src: (context, event) => generateEffect(event.prompt),
          onDone: {
            target: StateName.settingEffectSource,
            actions: [
              assign((context, event) => ({
                currentEffect: event.data,
              })),
            ],
          },
          onError: {
            target: StateName.settingEffectSource,
          },
        },
      },
      [StateName.settingEffectSource]: {
        on: {
          [EventName.SET_EFFECT_SOURCE]: {
            target: StateName.settingEffectTarget,
            actions: assign((context, event) => ({
              effectSource: event.source,
            })),
          },
        },
      },
      [StateName.settingEffectTarget]: {
        on: {
          [EventName.SET_EFFECT_TARGET]: {
            target: StateName.effectGeneration,
            actions: [
              changeCurrentPlayer,
              assign((context, event) => ({
                effectSource: null,
                currentEffect: null,
              })),
            ],
          },
        },
      },
      [StateName.end]: {
        type: "final",
      },
    },
  });
