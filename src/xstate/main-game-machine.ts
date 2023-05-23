import { toast } from "react-toastify";
import { assign, createMachine } from "xstate";
import { effectTypeSchema } from "../../api/enums/effect-type.enum";
import { Character } from "../../api/interfaces/character.interface";
import { Effect } from "../../api/interfaces/effect.inerface";
import { generateCharacter, generateCharacterImage, generateEffect } from "../api/api";
import { calculateModifier } from "../utils/calculate-modifiers";

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
  characters: NonNullable<Character>[];
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
          src: (context, event) =>
            generateCharacter(event.prompt).then(async (character) => ({
              ...character,
              imageUrl: (await generateCharacterImage(character.imagePrompt)).url,
            })),
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
            actions: assign((context, event) => ({
              characters: context.characters.map((character) =>
                character.receivingOvertimeDamage && character.overtimeDamageTurnsRemaining
                  ? {
                      ...character,
                      shield: Math.max(character.shield - character.receivingOvertimeDamage, 0),
                      health: Math.max(character.health + character.shield - character.receivingOvertimeDamage, 0),
                      overtimeDamageTurnsRemaining: character.overtimeDamageTurnsRemaining - 1,
                    }
                  : { ...character, receivingOvertimeDamage: undefined, overtimeDamageTurnsRemaining: undefined }
              ),
            })),
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
                characters: context.characters.map((character) => {
                  if (context.currentEffect && character.name === event.target) {
                    switch (context.currentEffect.type) {
                      case effectTypeSchema.Enum.Offense:
                        const damage =
                          context.currentEffect.damage *
                          calculateModifier(context.currentEffect.element, character.element);

                        toast(`${damage} ⚔️ ⇒ ${character.name}`);

                        break;

                      case effectTypeSchema.Enum.Defense:
                        const shield =
                          context.currentEffect.shield *
                          calculateModifier(context.currentEffect.element, character.element);

                        toast(`${shield} 🛡️ ⇒ ${character.name}`);
                        break;

                      case effectTypeSchema.Enum.Overtime:
                        const rounds = context.currentEffect.rounds;
                        const damageOvertime =
                          context.currentEffect.damage *
                          calculateModifier(context.currentEffect.element, character.element);

                        toast(`${damageOvertime} ⚔️ ${rounds} 🕒 ⇒ ${character.name}`);
                        break;
                    }
                  }

                  return context.currentEffect && character.name === event.target
                    ? context.currentEffect.type === effectTypeSchema.Enum.Offense
                      ? {
                          ...character,
                          shield: Math.max(
                            character.shield -
                              context.currentEffect.damage *
                                calculateModifier(context.currentEffect.element, character.element),
                            0
                          ),
                          health: Math.max(
                            character.health +
                              character.shield -
                              context.currentEffect.damage *
                                calculateModifier(context.currentEffect.element, character.element),
                            0
                          ),
                        }
                      : context.currentEffect.type === effectTypeSchema.Enum.Defense
                      ? {
                          ...character,
                          shield: Math.min(
                            character.shield +
                              context.currentEffect.shield *
                                calculateModifier(context.currentEffect.element, character.element),
                            50
                          ),
                        }
                      : context.currentEffect.type === effectTypeSchema.Enum.Overtime
                      ? {
                          ...character,
                          receivingOvertimeDamage:
                            context.currentEffect.damage *
                            calculateModifier(context.currentEffect.element, character.element),
                          overtimeDamageTurnsRemaining: context.currentEffect.rounds,
                        }
                      : character
                    : character;
                }),
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
