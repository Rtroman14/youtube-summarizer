"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVideoDetails } from "./actions";
import { useAutoScroll } from "@/components/ui/use-auto-scroll";
import { ArrowDown } from "lucide-react";
import { PaperAirplaneIcon, LinkIcon } from "@heroicons/react/24/solid";

import { ChatMessage } from "@/components/ui/ChatMessage";

export default function YouTubeSummarizer() {
    const [videoInfo, setVideoInfo] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const {
        messages,
        setMessages,
        handleSubmit,
        isLoading,
        append,
        input,
        setInput,
        handleInputChange,
    } = useChat({
        api: "/api/chat",
    });

    const { scrollRef, isAtBottom, autoScrollEnabled, scrollToBottom } = useAutoScroll({
        offset: 20,
        smooth: true,
        content: messages,
    });

    const handleFetchVideoSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsFetching(true);

            // Use the URL from the input field
            const videoUrl = input;

            // Fetch video details using server action
            const details = await getVideoDetails(videoUrl);

            // Update video info state
            setVideoInfo({
                title: details.title,
                thumbnailUrl: details.thumbnailUrl,
                url: videoUrl,
            });

            setMessages([]);

            // Send transcript to AI for summarization
            append({
                role: "user",
                content: `Provide a summary of the transcript for the YouTube video titled "${details.title}": """${details.transcript}"""`,
            });

            setInput("");
        } catch (error) {
            console.error("Error:", error);
            // You might want to show an error message to the user here
        } finally {
            setIsFetching(false);
        }
    };

    // https://www.youtube.com/watch?v=oAxXWk-d4ss

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">YouTube Video Summarizer</h1>
            <form onSubmit={handleFetchVideoSubmit} className="mb-6">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Enter YouTube URL"
                        className="flex-grow"
                    />
                    <Button type="submit" disabled={isLoading || isFetching}>
                        {isLoading || isFetching ? "Processing..." : "Summarize"}
                    </Button>
                </div>
            </form>
            {videoInfo && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            <a
                                href={videoInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-2"
                            >
                                <LinkIcon className="h-6 w-6" />

                                {videoInfo.title}
                            </a>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <img
                            src={videoInfo.thumbnailUrl || "/placeholder.svg"}
                            alt={videoInfo.title}
                            className="w-full rounded-md"
                        />
                    </CardContent>
                </Card>
            )}
            {messages.length > 1 && (
                <Card>
                    <CardContent className="mt-5">
                        <div className="relative">
                            <div
                                ref={scrollRef}
                                className="max-h-[800px] overflow-y-auto space-y-4"
                            >
                                {messages.slice(1).map((message) => (
                                    <div key={message.id}>
                                        <ChatMessage
                                            id={message.id}
                                            role={message.role}
                                            content={message.content}
                                        />
                                    </div>
                                ))}
                            </div>
                            {!isAtBottom && (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute bottom-4 right-4 rounded-full"
                                    onClick={scrollToBottom}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            )}

                            {/* Add chat input form */}
                            {isLoading || isFetching ? null : (
                                <div className="border-t mt-4 pt-4">
                                    <form onSubmit={handleSubmit} className="flex gap-2">
                                        <Input
                                            value={input}
                                            onChange={handleInputChange}
                                            placeholder="Ask a follow-up question..."
                                            className="flex-grow"
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            <PaperAirplaneIcon className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
