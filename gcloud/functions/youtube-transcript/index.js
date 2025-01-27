const functions = require("@google-cloud/functions-framework");
const axios = require("axios");
const { YoutubeTranscript } = require("youtube-transcript");

// Register HTTP function to fetch YouTube transcript
functions.http("youtube-info", async (req, res) => {
    try {
        // Get URL from query parameter
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                error: "Missing YouTube URL parameter",
            });
        }

        // Get video metadata
        const oembedUrl = `https://youtube.com/oembed?url=${url}&format=json`;
        const { data: metadata } = await axios.get(oembedUrl);

        // Get transcript
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        const transcriptText = transcript.map((entry) => entry.text).join(" ");

        // Return both metadata and transcript
        res.json({
            metadata,
            transcript: transcriptText,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Failed to fetch transcript",
            details: error.message,
        });
    }
});
