import { Handler } from "@netlify/functions";
import { readFileSync } from "fs";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import { Effect } from "../../api/interfaces/effect.inerface";
import { removeImportStatements } from "../../utils/remove-import-statements";

const handler: Handler = async (event) => {
  const { prompt = "Generic effect" } = event.queryStringParameters || {};

  const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY })
  );

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: `
                You are going to interpret each of the following messages as a name of an effect.
                For each prompt, you will respond only with json. This is crucial because this ouput
                will be parsed. Json should be modeled after the following Effect typescript type:
    
                \`\`\`
                ${removeImportStatements(
                  readFileSync(
                    path.join(__dirname, "../../api/enums/element-type.enum.ts")
                  ).toString()
                )}
                ${removeImportStatements(
                  readFileSync(
                    path.join(__dirname, "../../api/enums/effect-type.enum.ts")
                  ).toString()
                )}
                ${removeImportStatements(
                  readFileSync(
                    path.join(
                      __dirname,
                      "../../api/interfaces/effect.interface.ts"
                    )
                  ).toString()
                )}
                \`\`\`
    
                Take comments above properties into account when generating data.

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
  const effect: Effect | null = message ? JSON.parse(message.content) : null;

  return {
    statusCode: 200,
    body: JSON.stringify(effect && { ...effect, name: prompt }),
  };
};

export { handler };
