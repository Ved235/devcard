import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { imageData, username } = await request.json();

    if (!imageData || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const cardId = Date.now().toString();

    const filename = `${username}_${cardId}.png`;

    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "image/png",
    });

    return NextResponse.json({
      url: blob.url,
      cardId: cardId,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to store card" },
      { status: 500 }
    );
  }
}
