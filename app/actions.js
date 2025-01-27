"use server";

import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

export async function getVideoDetails(url) {
    try {
        // Get video metadata
        const { data: metadata } = await axios.get(
            `https://youtube.com/oembed?url=${url}&format=json`
        );

        // Get transcript
        const transcript = await YoutubeTranscript.fetchTranscript(url);

        // Convert transcript to text
        const transcriptText = transcript.map((entry) => entry.text).join(" ");

        return {
            success: true,
            data: {
                title: metadata.title,
                thumbnailUrl: metadata.thumbnail_url,
                transcript: transcriptText,
            },
        };
    } catch (error) {
        console.error("Error fetching video details:", error);
        return {
            success: false,
            message: error.message,
        };
    }
}
