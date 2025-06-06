import OpenAI from 'openai';

const DEFAULT_PROMPT =
  'You are given an image of someone in the process of fixing a McFlurry machine. Describe the image to full detail; it is likely going to be a part, something broken, an error message, a tool, or some other thing involved in the process of fixing it. Be as descriptive as possible.';

export abstract class ImageClient {
  abstract describeImage(base64Image: string, prompt?: string): Promise<string>;
}

export class OpenAIImageClient extends ImageClient {
  private openai: OpenAI;

  constructor() {
    super();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async describeImage(base64Image: string, prompt?: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt || DEFAULT_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    if (response.choices[0].message.content) {
      return response.choices[0].message.content;
    } else {
      throw new Error('Failed to describe image');
    }
  }
} 