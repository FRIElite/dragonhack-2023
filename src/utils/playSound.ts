import { ElementType } from "../../api/enums/element-type.enum";

export const sounds: Record<ElementType, string> = {
  [ElementType.Normal]: "/sounds/wind.mp3",
  [ElementType.Fire]: "/sounds/fire.mp3",
  [ElementType.Water]: "/sounds/water.wav",
  [ElementType.Electric]: "/sounds/electric.wav",
  [ElementType.Grass]: "/sounds/grass.wav",
  [ElementType.Ice]: "/sounds/ice.mp3",
  [ElementType.Fighting]: "/sounds/punch.mp3",
  [ElementType.Poison]: "/sounds/wind.mp3",
  [ElementType.Ground]: "/sounds/rock.wav",
  [ElementType.Flying]: "/sounds/flying.mp3",
  [ElementType.Psychic]: "/sounds/wind.mp3",
  [ElementType.Bug]: "/sounds/grass.wav",
  [ElementType.Rock]: "/sounds/rock.wav",
  [ElementType.Ghost]: "/sounds/wind.mp3",
  [ElementType.Dragon]: "/sounds/flying.mp3",
  [ElementType.Dark]: "/sounds/wind.mp3",
  [ElementType.Steel]: "/sounds/rock.wav",
  [ElementType.Fairy]: "/sounds/wind.mp3",
};

export function playSound(key: keyof typeof sounds) {
  return new Audio(sounds[key]).play();
}
