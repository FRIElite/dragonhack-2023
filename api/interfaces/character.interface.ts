import { ElementType } from "../enums/element-type.enum";

export interface Character {
  name: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  element: ElementType;
  health: number;
  playerId: string;
}
