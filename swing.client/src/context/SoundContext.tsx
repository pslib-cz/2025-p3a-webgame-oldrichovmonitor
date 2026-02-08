import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import gemSoundUrl from "../assets/sounds/gem.mp3";
import bombSoundUrl from "../assets/sounds/bomb.mp3";

interface SoundContextProps {
  playClick: () => void;
  playSoftClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playWin: () => void;
  playLose: () => void;
}

export const SoundContext = createContext<SoundContextProps | undefined>(
  undefined,
);

export function SoundProvider({ children }: { children: ReactNode }) {
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);

  const softClickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSound.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    );
    softClickSound.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3",
    );
    successSound.current = new Audio(gemSoundUrl);
    errorSound.current = new Audio(bombSoundUrl);
    winSound.current = new Audio(gemSoundUrl);
    loseSound.current = new Audio(bombSoundUrl);

    if (clickSound.current) clickSound.current.volume = 0.4;
    if (softClickSound.current) softClickSound.current.volume = 0.2;
    if (successSound.current) successSound.current.volume = 0.3;
    if (errorSound.current) errorSound.current.volume = 0.3;
    if (winSound.current) winSound.current.volume = 0.4;
    if (loseSound.current) loseSound.current.volume = 0.3;

  }, []);

  const playSound = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio play error:", e));
    }
  };

  const playClick = () => playSound(clickSound);
  const playSuccess = () => playSound(successSound);
  const playError = () => playSound(errorSound);
  const playWin = () => playSound(winSound);
  const playLose = () => playSound(loseSound);


  const playSoftClick = () => playSound(softClickSound);

  return (
    <SoundContext.Provider
      value={{ playClick, playSoftClick, playSuccess, playError, playWin, playLose }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
};
