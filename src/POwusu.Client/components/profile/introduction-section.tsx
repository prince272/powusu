"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { commonColors, semanticColors } from "@nextui-org/theme";
import * as THREE from "three";

import "vanta/dist/vanta.globe.min";

import { VantaGlobeInstance } from "@/vanta";
import SoloarAltArrowRightOutline from "@iconify/icons-solar/alt-arrow-right-outline";
import { useTheme } from "next-themes";

import { Icon } from "@/components/ui/icon";
import { useBreakpoint } from "@/hooks";

export const IntroductionSection = () => {
  const [vantaEffect, setVantaEffect] = useState<VantaGlobeInstance | null>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const md = useBreakpoint("md", "up");

  useEffect(() => {
    if (!vantaEffect && md) {
      setVantaEffect(
        VANTA.GLOBE({
          THREE,
          el: vantaRef.current!,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          size: 0.9,
          color: semanticColors.dark.secondary[500],
          color2: semanticColors.light.default[50],
          backgroundColor: semanticColors.dark.primary[50]
        })
      );
    }
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, [vantaEffect, theme, md]);

  return (
    <section id="intro" ref={vantaRef} className="relative h-full bg-primary-50 text-foreground dark">
      <div className="absolute h-full w-full backdrop-blur-sm md:backdrop-blur-none"></div>
      <div className="h-full">
        <div className="relative mx-auto h-full max-w-screen-xl px-6">
          <section className="align-items-center grid h-full grid-cols-12 space-x-10 pb-32 pt-16">
            <div className="col-span-12 flex items-center lg:col-span-8">
              <div className="max-w-[600px]">
                <div className="mb-6 flex justify-center sm:justify-start">
                  <div className="relative animate-updown">
                    <Image className="h-48 w-48 rounded-full border-5 border-white bg-white object-contain object-center" src="/assets/profile/1.png" alt="Prince Owusu" />
                    <Image classNames={{ wrapper: "absolute bottom-0 right-0 z-10 mb-2 mr-6" }} width={32} height={32} src="/favicon-32x32.png" alt="Prince Owusu Logo" />
                  </div>
                </div>
                <h1 className="mb-3 scroll-m-20 font-heading text-4xl uppercase tracking-wider drop-shadow-md before:absolute before:left-0 before:top-7 before:h-1 before:content-none lg:text-5xl">
                  <span>I&apos;m</span> <span className="text-primary">Prince Owusu</span>
                  <span className="block text-xl lg:text-2xl">👨‍💻 Software Engineer</span>
                </h1>
                <p className="mb-3 leading-9 tracking-wider drop-shadow-md">
                  I am a highly skilled Software Engineer with a passion for crafting seamless user experiences. I specialize in developing end-to-end applications that not only
                  meet requirements, but exceed user expectations.
                </p>
                <Button endContent={<Icon icon={SoloarAltArrowRightOutline} width="24" height="24" />} variant="flat" size="lg" color="primary" className="font-bold uppercase">
                  More about Me
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
