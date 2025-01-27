import { NextResponse } from "next/server"

export async function POST(req) {
  const { url } = await req.json()

  try {
    const oembedUrl = `https://youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const response = await fetch(oembedUrl)
    const data = await response.json()

    return NextResponse.json({
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    });
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching video information." },
      { status: 500 }
    );
  }
}

