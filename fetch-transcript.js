const axios = require("axios");

(async () => {
    try {
        const url = "https://youtu.be/caXIpc1y4Tg?si=i1PILOSUNOEYAHjM";

        // Get video metadata
        const { data } = await axios.get(
            `https://us-west1-webagent-394323.cloudfunctions.net/youtube-info?url=${url}`
        );

        console.log(`data -->`, data);
    } catch (error) {
        console.error("Error:", error);
    }
})();
