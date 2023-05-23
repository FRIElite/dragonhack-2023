import { z } from "zod";

export const effectTypeSchema = z.enum(["Offense", "Defense", "Overtime"]);

export type EffectType = z.infer<typeof effectTypeSchema>;
