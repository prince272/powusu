"use client";

import React, { ComponentProps, useEffect, useState } from "react";
import SolarPlayBold from "@iconify/icons-solar/play-bold";
import { Button } from "@nextui-org/button";
import { Bars } from "react-loader-spinner";
import useSound from "use-sound";
import { Icon } from "../ui/icon";

export type SongPlayerButtonProps = ComponentProps<typeof Button>;

const unlockAudioContext = (audioCtx: AudioContext, setIsAudioUnlocked: React.Dispatch<React.SetStateAction<boolean>>) => {
  if (audioCtx.state === 'suspended') {
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    const unlock = () => {
      events.forEach(event => document.body.removeEventListener(event, unlock));
      audioCtx.resume().then(() => setIsAudioUnlocked(true));
    };
    events.forEach(event => document.body.addEventListener(event, unlock, false));
  } else {
    setIsAudioUnlocked(true);
  }
};

export const SongPlayerButton = (props: SongPlayerButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [play, { stop }] = useSound("/audios/cool-sounds.mp3", { autoplay: false, loop: true });

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    unlockAudioContext(audioCtx, setIsAudioUnlocked);

    return () => {
      stop();
    };
  }, [stop]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && isAudioUnlocked) {
      play();
    } else {
      stop();
    }
  }, [isPlaying, isAudioUnlocked, play, stop]);

  const handleButtonClick = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 m-10">
      <Button size="lg" isIconOnly color="primary" radius="full" onPress={handleButtonClick} {...props}>
        {isPlaying && isAudioUnlocked ? (
          <Bars height="24" width="24" color="white" />
        ) : (
          <Icon icon={SolarPlayBold} width="24" height="24" />
        )}
      </Button>
    </div>
  );
};
