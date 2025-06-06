"use server";

import { OpenAIImageClient } from "./image_client";

const client = new OpenAIImageClient();
export async function describeImage(dataUrl) {
  try {
    const response = await client.describeImage(dataUrl);
    return response;
  } catch (error) {
    console.error("Error describing image:", error);
    throw error;
  }
}
