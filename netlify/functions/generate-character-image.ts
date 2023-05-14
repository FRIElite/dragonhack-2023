import { Handler } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";

const handler: Handler = async (event) => {
  const { prompt = "Generic character" } = event.queryStringParameters || {};

  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: await openai
        .createImage(
          {
            prompt,
            n: 1,
            size: "256x256",
          },
          {
            timeout: 10_000,
          }
        )
        .then((res) => res.data.data[0]?.url),
    }),
  };
};

export { handler };
