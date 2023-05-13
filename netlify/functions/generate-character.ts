import { Handler } from "@netlify/functions";
import { readFileSync } from "fs";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import { Character } from "../../api/interfaces/character.interface";
import { removeImportStatements } from "../../utils/remove-import-statements";

const handler: Handler = async (event) => {
  const { prompt = "Generic character" } = event.queryStringParameters || {};

  const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY })
  );

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: `
                You are going to interpret each of the following messages as a name of a character.
                For each prompt, you will respond only with json. This is crucial because this ouput
                will be parsed. Json should be modeled after the following Character typescript interface:
    
                \`\`\`
                ${removeImportStatements(
                  readFileSync(
                    path.join(__dirname, "../../api/enums/element-type.enum.ts")
                  ).toString()
                )}
                ${removeImportStatements(
                  readFileSync(
                    path.join(
                      __dirname,
                      "../../api/interfaces/character.interface.ts"
                    )
                  ).toString()
                )}
                \`\`\`
    
                Property imagePrompt will be used to generate an image, so make it sufficiently descriptive.
                Health property will have a value between 0 and 100.

                The goal is to use this data in a turn based game similar to Pokemon. Make the descriptions funny.
            `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const message = response.data.choices[0]?.message;
  const character: Character | null = message
    ? JSON.parse(message.content)
    : null;

  return {
    statusCode: 200,
    body: JSON.stringify(character && { ...character, name: prompt }),
  };
};

export { handler };
