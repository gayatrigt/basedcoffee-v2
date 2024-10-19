"use client";
import { Pause, Play, VolumeX, Volume2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useMutedStore } from "~/store/muteStore";

interface FeedVideoProps {
    src: string;
    inView: boolean;
}

export const FeedVideo: React.FC<FeedVideoProps> = ({ src, inView }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { isMuted, toggleMute, setMuted } = useMutedStore();
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const playVideo = useCallback(async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.play();

                // un-mute if video is playing
                videoRef.current.muted = false; // un-mute if video is playing  
                setMuted(true)
                setIsPlaying(true);
            } catch (error) {
                console.error("Error playing video:", error);
            }
        }
    }, []);

    const pauseVideo = useCallback(async () => {
        if (videoRef.current) {
            try {
                void videoRef.current.pause();
                setIsPlaying(false);
            } catch (error) {
                console.error("Error pausing video:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (inView && !isHolding) {
            void playVideo();
        } else {
            void pauseVideo();
        }
    }, [inView, isHolding, playVideo, pauseVideo]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            void pauseVideo();
        } else if (inView && !isHolding) {
            void playVideo();
        }
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [inView, isHolding, playVideo, pauseVideo]);

    const handleTouchStart = useCallback(() => {
        holdTimeoutRef.current = setTimeout(() => {
            setIsHolding(true);
            void pauseVideo();
        }, 200); // 200ms delay to differentiate between tap and hold
    }, [pauseVideo]);

    const handleTouchEnd = useCallback(() => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        if (isHolding) {
            setIsHolding(false);
            if (inView) {
                void playVideo();
            }
        } else {
            toggleMute();
        }
    }, [isHolding, inView, playVideo, toggleMute]);


    const togglePlay = useCallback(async () => {
        if (isPlaying) {
            await pauseVideo();
        } else {
            await playVideo();
        }
    }, [isPlaying, pauseVideo, playVideo]);

    return (
        <div className="relative w-auto h-full aspect-auto">
            <video
                ref={videoRef}
                src={src}
                className="h-full object-cover w-[56.25vh] mx-auto"
                loop
                muted={isMuted}

                playsInline
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button onClick={() => void togglePlay()} className="p-2 bg-black bg-opacity-50 rounded-full text-white aspect-square">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={toggleMute} className="p-2 bg-black bg-opacity-50 rounded-full text-white aspect-square">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </div>
        </div>
    );
};