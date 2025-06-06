import OpenAI from 'openai';

const DEFAULT_PROMPT =
  'You are given an image of someone in the process of fixing a McFlurry machine. Describe the image to full detail; it is likely going to be a part, something broken, an error message, a tool, or some other thing involved in the process of fixing it. Be as descriptive as possible.';

class ImageClient {
  describeImage(base64Image, prompt) {
    throw new Error('Method not implemented');
  }
}

class OpenAIImageClient extends ImageClient {
  constructor() {
    super();
    const apiKey = process.env.OPENAI_API_KEY || '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';
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async describeImage(base64Image, prompt) {
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

module.exports = { ImageClient, OpenAIImageClient };