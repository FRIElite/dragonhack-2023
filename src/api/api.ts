import { Character } from "../../api/interfaces/character.interface";
import { Effect } from "../../api/interfaces/effect.inerface";

const API_URL = ".netlify/functions";

export const generateCharacter = (prompt: string): Promise<Character> =>
  fetch(
    `${API_URL}/generate-character?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());

export const generateCharacterImage = (prompt: string): Promise<{ url: string }> =>
  fetch(
    `${API_URL}/generate-character-image?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());

export const generateEffect = (prompt: string): Promise<Effect> =>
  fetch(
    `${API_URL}/generate-effect?${new URLSearchParams({
      prompt,
    })}`
  ).then((res) => res.json());
