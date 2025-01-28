const axios = require("axios");
const { YoutubeTranscript } = require("youtube-transcript");

(async () => {
    try {
        // const url = "https://www.youtube.com/watch?v=TVUibwoVXZc";
        const url = "https://www.youtube.com/watch?v=6elnsE7T_Ws&t=5s";

        // Get video metadata
        const oembedUrl = `https://youtube.com/oembed?url=${url}&format=json`;
        const { data: metadata } = await axios.get(oembedUrl);
        console.log("Video Metadata:", metadata);

        // Get transcript
        const transcript = await YoutubeTranscript.fetchTranscript(url);

        // Convert transcript to text
        const transcriptText = transcript.map((entry) => entry.text).join(" ");
        console.log("Video Transcript:", transcriptText);
    } catch (error) {
        console.error("Error:", error);
    }
})();
