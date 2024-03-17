"use client";

import NextLink from "next/link";
import QuestionsIllustration from "@/assets/illustrations/questions.svg";
import { wrapHtml } from "@/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { siteConfig } from "@/config/site";

export const FaqsSection = () => {
  return (
    <section id="faqs" className="bg-background py-24">
      <div className="relative mx-auto max-w-screen-xl px-6">
        <div className="mb-6 flex justify-center">
          <div className="flex max-w-xl flex-col text-center">
            <h2 className="mb-1 font-medium text-primary">FAQs</h2>
            <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
              Frequently Asked <span className="text-secondary">Questions</span>
            </h1>
            <h2 className="mb-3 text-default-500">Get to know me better through these frequently asked questions.</h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="relative col-span-12 md:col-span-5">
            <div className="flex aspect-[4/3] justify-center">
              <QuestionsIllustration className="h-full max-h-[384px] w-full max-w-[384px] text-default-50" width="100%" height="100%" preserveAspectRatio="none" />
            </div>
          </div>
          <div className="md:order-0 order-1 col-span-12 md:col-span-7">
            <Accordion variant="light" className="gap-6" itemClasses={{ title: "font-semibold data-[open=true]:text-primary", content: "leading-loose pb-4" }}>
              {siteConfig.faqs
                .map((faq) => ({ ...faq, answer: wrapHtml(faq.answer) }))
                .map((faq) => {
                  return (
                    <AccordionItem key={faq.id} aria-label="Accordion 1" title={faq.question}>
                      {faq.answer}
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
