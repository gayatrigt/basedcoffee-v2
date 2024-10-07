"use client";
import { Pause, Play, VolumeX, Volume2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useMutedStore } from "~/store/muteStore";

interface VideoPlayerProps {
    src: string;
    inView: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, inView }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { isMuted, toggleMute } = useMutedStore();
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (inView && !isHolding) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [inView, isHolding]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                videoRef.current?.pause();
                setIsPlaying(false);
            } else if (inView && videoRef.current && !isHolding) {
                videoRef.current.play();
                setIsPlaying(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [inView, isHolding]);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const handleTouchStart = useCallback(() => {
        holdTimeoutRef.current = setTimeout(() => {
            setIsHolding(true);
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }, 200); // 200ms delay to differentiate between tap and hold
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        if (isHolding) {
            setIsHolding(false);
            if (videoRef.current && inView) {
                videoRef.current.play();
                setIsPlaying(true);
            }
        } else {
            toggleMute();
        }
    }, [isHolding, inView, toggleMute]);

    return (
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button onClick={togglePlay} className="p-2 bg-black bg-opacity-50 rounded-full text-white aspect-square">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={toggleMute} className="p-2 bg-black bg-opacity-50 rounded-full text-white aspect-square">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </div>
        </div>
    );
};