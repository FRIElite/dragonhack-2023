import { assign, createMachine } from "xstate";
import { EffectType } from "../api/enums/effect-type.enum";
import { ElementType } from "../api/enums/element-type.enum";
import { Character } from "../api/interfaces/character.interface";
import { Effect } from "../api/interfaces/effect.inerface";

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
  characters: (Character & { owner: string })[];
  currentPlayerId: string | null;
  currentEffect: Effect | null;
  effectSource: string | null;
}

const changeCurrentPlayer = assign((context: MainGameMachineContext) => ({
  currentPlayerId:
    context.playerIds[
      (context.playerIds.findIndex((val) => val === context.currentPlayerId) +
        1) %
        context.playerIds.length
    ],
}));

export const mainGameMachine = (MAX_PLAYERS = 2) =>
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
              playerIds: [...context.playerIds, event.name],
              currentPlayerId: context.playerIds[0] || event.name || null,
            })),
          },
        },
        always: [
          {
            target: StateName.characterGeneration,
            cond: (context) =>
              Object.keys(context.playerIds).length >= MAX_PLAYERS,
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
                (playerId) =>
                  context.characters.filter((c) => c.owner === playerId)
                    .length === 3
              ),
          },
        ],
      },
      [StateName.loadingCharacter]: {
        invoke: {
          id: "fetchCharacter",
          src: (context, event) =>
            new Promise((resolve) =>
              setTimeout(() => {
                resolve("123");
              }, 1000)
            ),
          onDone: {
            target: StateName.characterGeneration,
            actions: [
              assign((context) => ({
                characters: [
                  ...context.characters,
                  {
                    name: "Placeholder",
                    description: "Descr",
                    imagePrompt: "Image",
                    element: ElementType.Normal,
                    health: 50,
                    owner: context.currentPlayerId,
                  },
                ],
              })),
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
              context.characters
                .filter((c) => c.owner === context.currentPlayerId)
                .every((c) => c.health <= 0),
          },
        ],
      },
      [StateName.loadingEffect]: {
        invoke: {
          id: "fetchEffect",
          src: (context, event) =>
            new Promise((resolve) =>
              setTimeout(() => {
                resolve("456");
              }, 1000)
            ),
          onDone: {
            target: StateName.settingEffectSource,
            actions: [
              assign((context) => ({
                currentEffect: {
                  type: EffectType.Defense,
                  shield: 10,
                  element: ElementType.Normal,
                  name: "Placholder",
                  description: "Descr",
                },
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
              effectSource: "player1",
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
