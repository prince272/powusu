"use client";

import { Image } from "@nextui-org/image";

export const QuoteSection = () => {
  return (
    <div id="quote" className="relative">
      <Image
        shadow="none"
        classNames={{ wrapper: "absolute flex justify-center items-center w-full h-full !max-w-none !rounded-none", img: "w-full h-full object-cover object-center !rounded-none" }}
        src="/assets/future.jpg"
        alt="Future"
      />
      <div className="relative z-10 bg-background/70 p-8 py-24 text-center backdrop-blur-sm backdrop-saturate-150">
        <blockquote className="font-serif text-4xl italic">&quot;The only way to predict the future is to create it.&quot;</blockquote>
        <cite className="mt-4 block font-semibold text-default-600">- Abraham Lincoln</cite>
      </div>
    </div>
  );
};
