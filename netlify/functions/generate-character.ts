import { Handler } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";
import { Character, characterSchema } from "../../api/interfaces/character.interface";
import { withSafeTimeout } from "../../utils/with-safe-timeout";

const handler: Handler = async (event) => {
  const { prompt = "Regular person" } = event.queryStringParameters || {};

  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

  const character = await withSafeTimeout(
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: `
                You are going to interpret each of the following messages as a name of a character.
                For each prompt, you will respond only with json. This is crucial because this ouput
                will be parsed. Json should be modeled after the following Character typescript interface:
    
                \`\`\`
                export enum ElementType {
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
                export interface Character {
                  name: string;
                  description: string;
                  imagePrompt: string;
                  element: ElementType;
                  health: number;
                }
                \`\`\`
    
                Property imagePrompt will be used to generate an image, so make it sufficiently descriptive.
                Health property will have a value between 0 and 100.

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
      })
      .then((response): Character => {
        const message = response.data.choices[0]?.message;
        return message ? JSON.parse(message.content) : null;
      }),
    9_800
  )
    .then((res) => characterSchema.parse(res))
    .catch(() => characterSchema.parse({}));

  return {
    statusCode: 200,
    body: JSON.stringify(character && { ...character, shield: 0, name: prompt }),
  };
};

export { handler };
