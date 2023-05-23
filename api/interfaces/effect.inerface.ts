import { z } from "zod";
import { effectTypeSchema } from "../enums/effect-type.enum";
import { elementTypeSchema } from "../enums/element-type.enum";

export const effectSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(effectTypeSchema.Enum.Defense),
      shield: z.number().catch(0),
    }),
    z.object({
      type: z.literal(effectTypeSchema.Enum.Offense),
      damage: z.number().catch(0),
    }),
    z.object({
      type: z.literal(effectTypeSchema.Enum.Overtime),
      damage: z.number().catch(0),
      rounds: z.number().catch(0),
    }),
  ])
  .and(
    z.object({
      element: elementTypeSchema,
      description: z.string().catch("Generic effect"),
      name: z.string().catch("Generic effect"),
    })
  )
  .nullable()
  .catch(null);

export type Effect = z.infer<typeof effectSchema>;
