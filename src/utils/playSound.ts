import { ElementType, elementTypeSchema } from "../../api/enums/element-type.enum";

export const sounds: Record<ElementType, string> = {
  [elementTypeSchema.Enum.Normal]: "/sounds/wind.mp3",
  [elementTypeSchema.Enum.Fire]: "/sounds/fire.mp3",
  [elementTypeSchema.Enum.Water]: "/sounds/water.wav",
  [elementTypeSchema.Enum.Electric]: "/sounds/electric.wav",
  [elementTypeSchema.Enum.Grass]: "/sounds/grass.wav",
  [elementTypeSchema.Enum.Ice]: "/sounds/ice.mp3",
  [elementTypeSchema.Enum.Fighting]: "/sounds/punch.mp3",
  [elementTypeSchema.Enum.Poison]: "/sounds/wind.mp3",
  [elementTypeSchema.Enum.Ground]: "/sounds/rock.wav",
  [elementTypeSchema.Enum.Flying]: "/sounds/flying.mp3",
  [elementTypeSchema.Enum.Psychic]: "/sounds/wind.mp3",
  [elementTypeSchema.Enum.Bug]: "/sounds/grass.wav",
  [elementTypeSchema.Enum.Rock]: "/sounds/rock.wav",
  [elementTypeSchema.Enum.Ghost]: "/sounds/wind.mp3",
  [elementTypeSchema.Enum.Dragon]: "/sounds/flying.mp3",
  [elementTypeSchema.Enum.Dark]: "/sounds/wind.mp3",
  [elementTypeSchema.Enum.Steel]: "/sounds/rock.wav",
  [elementTypeSchema.Enum.Fairy]: "/sounds/wind.mp3",
};

export function playSound(key: keyof typeof sounds) {
  return new Audio(sounds[key]).play();
}
