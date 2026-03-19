import { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
    const audioRef = useRef(new Audio());
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audio = audioRef.current;

    audio.ontimeupdate = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => { setIsPlaying(false); setProgress(0); };

    function playTrack(track) {
        if (currentTrack?.id === track.id) {
            if (isPlaying) { audio.pause(); setIsPlaying(false); }
            else { audio.play(); setIsPlaying(true); }
        } else {
            audio.pause();
            audio.src = track.uri;
            audio.load();
            audio.play();
            setCurrentTrack(track);
            setIsPlaying(true);
            setProgress(0);
        }
    }

    function handleSeek(e) {
        if (!audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
        setProgress(ratio * 100);
    }

    function stopAudio() {
        audio.pause();
        audio.src = "";
        setCurrentTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
    }

    function fmt(s) {
        if (!s || isNaN(s)) return "0:00";
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    }

    return (
        <AudioContext.Provider value={{
            currentTrack, isPlaying, progress, duration,
            playTrack, handleSeek, fmt, setIsPlaying, audioRef, stopAudio
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioContext);
}