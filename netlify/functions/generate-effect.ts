import { Handler } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";
import { Effect } from "../../api/interfaces/effect.inerface";

const handler: Handler = async (event) => {
  const { prompt = "Generic effect" } = event.queryStringParameters || {};

  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "assistant",
          content: `
                You are going to interpret each of the following messages as a name of an effect.
                For each prompt, you will respond only with json. This is crucial because this ouput
                will be parsed. Json should be modeled after the following Effect typescript type:
    
                \`\`\`
ž                export enum ElementType {
                  Normal = "Normal",
                  Fire = "Fire",
                  Water = "Water",
                  Electric = "Electric",
                  Grass = "Grass",
                  Ice = "Ice",
                  Fighting = "Fighting",
                  Poison = "Poison",
                  Ground = "Ground",
                  Flying = "Flying",
                  Psychic = "Psychic",
                  Bug = "Bug",
                  Rock = "Rock",
                  Ghost = "Ghost",
                  Dragon = "Dragon",
                  Dark = "Dark",
                  Steel = "Steel",
                  Fairy = "Fairy",
                }
                export enum EffectType {
                  Offense = "Offense",
                  Defense = "Defense",
                  Overtime = "Overtime",
                }
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
                
                \`\`\`
    
                Take comments above properties into account when generating data.

                The goal is to use this data in a turn based game similar to Pokemon. Make the descriptions funny.

                If you deem prompt inappropriate or offensive, try taming it down or provide some generic response. It
                is very important you always respond with a json in the specified format.
            `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      timeout: 10_000,
    }
  );
  const message = response.data.choices[0]?.message;
  const effect: Effect | null = message ? JSON.parse(message.content) : null;

  return {
    statusCode: 200,
    body: JSON.stringify(effect && { ...effect, name: prompt }),
  };
};

export { handler };
