import { z } from "zod";
import { elementTypeSchema } from "../enums/element-type.enum";

export const characterSchema = z
  .object({
    name: z.string().catch("Regular person"),
    description: z.string().catch("Generic description"),
    imagePrompt: z.string().catch("A default character"),
    imageUrl: z.string().optional(),
    element: elementTypeSchema.catch("Normal"),
    health: z.number().catch(50),
    playerId: z.string().optional(),
    shield: z.number().catch(0),
    receivingOvertimeDamage: z.number().optional(),
    overtimeDamageTurnsRemaining: z.number().optional(),
  })
  .nullable()
  .catch(null);

export type Character = z.infer<typeof characterSchema>;
