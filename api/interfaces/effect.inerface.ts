import { EffectType } from "../enums/effect-type.enum";
import { ElementType } from "../enums/element-type.enum";

export type Effect = (
  | {
      type: EffectType.Offense;
      damage: number;
      actionType: "slash" | "shoot";
    }
  | {
      type: EffectType.Defense;
      shield: number;
    }
  | {
      type: EffectType.Overtime;
      damage: number;
      rounds: number;
    }
) & {
  element: ElementType;
  description: string;
  name: string;
};
