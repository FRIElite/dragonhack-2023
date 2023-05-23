import { Character } from "../../api/interfaces/character.interface";
import { Effect } from "../../api/interfaces/effect.inerface";

const API_URL = ".netlify/functions";

// export const generateCharacter = (prompt: string): Promise<Character> =>
//   Promise.resolve({
//     name: crypto.randomUUID(),
//     description: "A mad scientist obsessed with physical fitness experiments. His muscles are as big as his ego.",
//     imagePrompt: "A maniacal scientist in a lab coat flexing his muscles in front of a gym",
//     element: ElementType.Normal,
//     health: 75,
//     playerId: "test",
//     shield: 0,
//   });

export const generateCharacter = (prompt: string): Promise<NonNullable<Character>> =>
  fetch(
    `${API_URL}/generate-character?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());

// export const generateCharacterImage = (prompt: string): Promise<{ url: string }> =>
//   Promise.resolve({
//     url: defaultImageUrl,
//   });

export const generateCharacterImage = (prompt: string): Promise<{ url: string }> =>
  fetch(
    `${API_URL}/generate-character-image?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());

// export const generateEffect = (prompt: string): Promise<Effect> =>
//   Promise.resolve({
//     type: EffectType.Offense,
//     damage: 10,
//     element: ElementType.Fighting,
//     description: "Unleashes fiery punches, leaving opponents burnt and defeated.",
//     name: "firefy fists",
//   });

// export const generateEffect = (prompt: string): Promise<Effect> =>
//   Promise.resolve({
//     type: EffectType.Defense,
//     shield: 10,
//     element: ElementType.Fighting,
//     description: "Unleashes fiery punches, leaving opponents burnt and defeated.",
//     name: "firefy fists",
//   });

// export const generateEffect = (prompt: string): Promise<Effect> =>
//   Promise.resolve({
//     type: EffectType.Overtime,
//     damage: 10,
//     rounds: 3,
//     element: ElementType.Fighting,
//     description: "Unleashes fiery punches, leaving opponents burnt and defeated.",
//     name: "firefy fists",
//   });

export const generateEffect = (prompt: string): Promise<NonNullable<Effect>> =>
  fetch(
    `${API_URL}/generate-effect?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());
