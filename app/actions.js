"use server";

import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";

const fetchYoutubeInfo = async (url) => {
    try {
        // Get video metadata
        const oembedUrl = `https://youtube.com/oembed?url=${url}&format=json`;
        const { data: metadata } = await axios.get(oembedUrl);

        // Get transcript
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        const transcriptText = transcript.map((entry) => entry.text).join(" ");

        return {
            success: true,
            data: {
                metadata,
                transcript: transcriptText,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

export async function getVideoDetails(url) {
    try {
        // Use fetchYoutubeInfo directly in development
        if (process.env.NODE_ENV === "development") {
            const result = await fetchYoutubeInfo(url);
            if (!result.success) {
                throw new Error(result.message);
            }

            return {
                success: true,
                data: {
                    title: result.data.metadata.title,
                    thumbnailUrl: result.data.metadata.thumbnail_url,
                    transcript: result.data.transcript,
                },
            };
        }

        // In production, use the external API
        const { data } = await axios.get(`${process.env.YOUTUBE_INFO_URL}?url=${url}`);
        return {
            success: true,
            data: {
                title: data.metadata.title,
                thumbnailUrl: data.metadata.thumbnail_url,
                transcript: data.transcript,
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
