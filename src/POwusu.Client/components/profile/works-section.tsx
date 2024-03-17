"use client";

import { useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Autoplay as SwiperAutoplay, Pagination as SwiperPagination, Virtual as SwiperVirtual, Virtual } from "swiper/modules";
import Lightbox, { Slide as LightboxSlide } from "yet-another-react-lightbox";

import { Link as NextLink } from "@/components/ui/navigation";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/virtual";

import { cn } from "@/utils";
import SolarAltArrowLeftOutline from "@iconify/icons-solar/alt-arrow-left-outline";
import SolarAltArrowRightOutline from "@iconify/icons-solar/alt-arrow-right-outline";
import SolarCloseCircleOutline from "@iconify/icons-solar/close-circle-outline";
import SolarGalleryBold from "@iconify/icons-solar/gallery-bold";
import SolarLinkBold from "@iconify/icons-solar/link-bold";
import { Chip } from "@nextui-org/chip";
import { Swiper, SwiperSlide } from "swiper/react";

import { SiteConfig, siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";

export const WorksSection = () => {
  const [selectedWork, setSelectedWork] = useState<SiteConfig["works"][0] | null>(null);

  return (
    <section id="works" className="bg-default-50 py-24">
      <div className="relative mx-auto max-w-screen-xl px-6">
        <div className="flex flex-col text-center">
          <h2 className="mb-1 font-medium text-primary">Works</h2>
          <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
            Featured <span className="text-secondary">Works</span>
          </h1>
          <h2 className="mb-6 text-default-500">Discover my inspiring creations, crafted with passion and purpose.</h2>
        </div>
        <Swiper
          wrapperClass="mb-14"
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${cn(className, "!w-3 !h-3 [&.swiper-pagination-bullet-active]:!bg-primary [&.swiper-pagination-bullet]:bg-default-300 !opacity-100")}"></span>`;
            }
          }}
          virtual={true}
          modules={[SwiperPagination, SwiperAutoplay, SwiperVirtual]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            }
          }}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          className="flex w-full"
        >
          {siteConfig.works.map((work, index) => (
            <SwiperSlide key={work.id} virtualIndex={index}>
              <Card className="flex flex-col gap-4 bg-background">
                <CardHeader className="relative pb-0" onClick={() => setSelectedWork(work)}>
                  <div className="group relative">
                    <Image removeWrapper alt={work.title} className="aspect-[4/3] w-full rounded-xl object-cover object-center" src={work.defaultImage} />
                    <div className="absolute top-0 z-20 flex h-full w-full items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button
                        startContent={<Icon icon={SolarGalleryBold} width="24" height="24" />}
                        size="lg"
                        color={index % 2 == 0 ? "primary" : "secondary"}
                        onPress={() => setSelectedWork(work)}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                  <Image
                    classNames={{ wrapper: "absolute bottom-0 right-0 z-10 mb-2 mr-6 bg-white p-2 rounded-full shadow" }}
                    width={64}
                    height={64}
                    src={work.logo}
                    alt={`${work.title} Logo`}
                  />
                </CardHeader>
                <CardBody className="relative pt-0">
                  <Chip className="mb-2">{work.name.toLowerCase()}</Chip>
                  <h3 className={cn("mb-1 line-clamp-1 text-large font-bold", index % 2 == 0 ? "text-primary" : "text-secondary")}>{work.title}</h3>
                  <p className="mb-3 line-clamp-3 h-[72px] text-default-500">{work.description}</p>
                  <Button
                    as={NextLink}
                    href={work.link}
                    target="_blank"
                    variant="flat"
                    color="default"
                    fullWidth
                    startContent={<Icon icon={SolarLinkBold} width="24" height="24" />}
                    className="after:absolute after:inset-0"
                  >
                    Read more
                  </Button>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <Lightbox
          open={!!selectedWork}
          close={() => setSelectedWork(null)}
          slides={selectedWork?.images.map((image) => ({ src: image }) as LightboxSlide) || []}
          render={{
            iconPrev: () => <Icon icon={SolarAltArrowLeftOutline} width="28" height="28" className="drop-shadow" />,
            iconNext: () => <Icon icon={SolarAltArrowRightOutline} width="28" height="28" className="drop-shadow" />,
            iconClose: () => <Icon icon={SolarCloseCircleOutline} width="24" height="24" className="drop-shadow" />
          }}
        />
      </div>
    </section>
  );
};
