"use server";

import axios from "axios";

export async function getVideoDetails(url) {
    try {
        // Get video metadata
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
