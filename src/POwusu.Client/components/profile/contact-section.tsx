"use client";

import NextLink from "next/link";
import ConversationIllustration from "@/assets/illustrations/conversation.svg";
import LogosWhatsappMonochromeIcon from "@iconify-icons/logos/whatsapp-monochrome-icon";
import DeviconGithub from "@iconify/icons-devicon/github";
import DeviconTwitter from "@iconify/icons-devicon/twitter";
import SolarMailboxBold from "@iconify/icons-solar/mailbox-bold";
import SolarPhoneBold from "@iconify/icons-solar/phone-bold";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";

export const ContactSection = () => {
  return (
    <section id="contact" className="bg-background py-24">
      <div className="relative mx-auto max-w-screen-xl px-6">
        <div className="mb-6 flex justify-center">
          <div className="flex max-w-xl flex-col text-center">
            <h2 className="mb-1 font-medium text-primary">Contact</h2>
            <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
              Get in <span className="text-secondary">Touch</span>
            </h1>
            <h2 className="mb-3 text-default-500">Let&apos;s Connect, Discuss, and Explore Together.</h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="relative col-span-12 md:col-span-5">
            <div className="flex aspect-[4/3] justify-center">
              <ConversationIllustration className="max-h-[384px] w-auto max-w-[384px] animate-updown text-default-50" width="100%" height="100%" preserveAspectRatio="none" />
            </div>
          </div>
          <div className="md:order-0 order-1 col-span-12 md:col-span-7">
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Reach Out to Me</h2>
            <p className="mb-3">
              Your thoughts, questions, and feedback matter to me. Whether you&apos;re interested in learning more about me, what I offer or just want to say hi, don&apos;t
              hesitate to get in touch.
              <br />
              <br />
              Let&apos;s start a conversation today!
            </p>
            <div className="space-y-4">
              <div className="relative inline-flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-50">
                  <Icon icon={SolarPhoneBold} width="24" height="24" className="text-secondary" />
                </div>
                <div>
                  <a href="tel:+233550362337" className="after:absolute after:inset-0">
                    (+233) 55 036 2337
                  </a>
                </div>
              </div>
              <br />
              <div className="relative inline-flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                  <Icon icon={SolarMailboxBold} width="24" height="24" className="text-primary" />
                </div>
                <div>
                  <a href="mail:princeowusu.272@gmail.com" className="after:absolute after:inset-0">
                    princeowusu.272@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Tooltip content="Github">
                  <Button as={NextLink} href={siteConfig.links.github} target="_blank" variant="light" color="secondary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon={DeviconGithub} className="text-secondary" width="32" height="32" />
                  </Button>
                </Tooltip>
                <Tooltip content="Twitter">
                  <Button as={NextLink} href={siteConfig.links.twitter} target="_blank" variant="light" color="primary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon={DeviconTwitter} className="text-primary" width="32" height="32" />
                  </Button>
                </Tooltip>
                <Tooltip content="WhatsApp">
                  <Button as={NextLink} href={siteConfig.links.whatsapp} target="_blank" variant="light" color="secondary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon={LogosWhatsappMonochromeIcon} width="32" height="32" />
                  </Button>
                </Tooltip>
                <Tooltip content="LinkedIn">
                  <Button as={NextLink} href={siteConfig.links.linkedin} target="_blank" variant="light" color="primary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon="devicon-plain:linkedin" width="32" height="32" />
                  </Button>
                </Tooltip>
                <Tooltip content="Telegram">
                  <Button as={NextLink} href={siteConfig.links.telegram} target="_blank" variant="light" color="secondary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon="ic:baseline-telegram" width="32" height="32" />
                  </Button>
                </Tooltip>
                <Tooltip content="Stackoverflow">
                  <Button as={NextLink} href={siteConfig.links.stackoverflow} target="_blank" variant="light" color="primary" isIconOnly className="h-9 w-9 min-w-fit">
                    <Icon icon="simple-icons:stackoverflow" width="32" height="32" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
