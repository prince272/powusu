"use client";

import { useMemo, useState } from "react";
import { Link as NextLink } from "@/providers/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Autoplay as SwiperAutoplay, Pagination as SwiperPagination } from "swiper/modules";
import Lightbox, { Slide as LightboxSlide } from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/pagination";

import { cn } from "@/utils";
import { Chip } from "@nextui-org/chip";
import { Swiper, SwiperSlide } from "swiper/react";

import { SiteConfig, siteConfig } from "@/config/site";

import { Icon } from "../ui/icon";

export const CertificatesSection = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<SiteConfig["certificates"][0] | null>(null);

  return (
    <section id="certificates" className="bg-background pb-24 pt-24">
      <div className="container relative mx-auto flex max-w-screen-xl flex-col items-center justify-center">
        <div className="flex max-w-xl flex-col text-center">
          <h2 className="mb-1 font-medium text-primary">Certificates</h2>
          <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
            Achieved <span className="text-secondary">Certificates</span>
          </h1>
          <h2 className="mb-6 text-default-500">Discover my journey of growth and achievement.</h2>
        </div>
        <Swiper
          wrapperClass="mb-14"
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${cn(className, "!w-3 !h-3 [&.swiper-pagination-bullet-active]:!bg-primary [&.swiper-pagination-bullet]:bg-default-300 !opacity-100")}"></span>`;
            }
          }}
          modules={[SwiperPagination, SwiperAutoplay]}
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
          {siteConfig.certificates.map((certificate, index) => (
            <SwiperSlide key={certificate.id} virtualIndex={index}>
              <Card className="flex flex-col gap-4">
                <CardHeader className="relative pb-0" onClick={() => setSelectedCertificate(certificate)}>
                  <div className="group relative">
                    <Image removeWrapper alt={certificate.title} className="aspect-[4/3] rounded-xl object-cover object-center" src={certificate.image} />
                    <div className="absolute top-0 z-20 flex h-full w-full items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button
                        startContent={<Icon icon="solar:gallery-bold" width="24" height="24" />}
                        size="lg"
                        color={index % 2 == 0 ? "primary" : "secondary"}
                        onPress={() => setSelectedCertificate(certificate)}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative pt-0">
                  <h3 className={cn("mb-3 line-clamp-1 text-large font-bold")}>
                    <Chip className="mr-2" color={index % 2 == 0 ? "primary" : "secondary"}>
                      {certificate.year}
                    </Chip>
                    {certificate.title}
                  </h3>
                  <Button
                    as={NextLink}
                    href={certificate.document}
                    download
                    target="_blank"
                    variant="flat"
                    color="default"
                    fullWidth
                    startContent={<Icon icon="solar:download-linear" width="24" height="24" />}
                    className="after:absolute after:inset-0"
                  >
                    Download
                  </Button>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <Lightbox
          open={!!selectedCertificate}
          close={() => setSelectedCertificate(null)}
          slides={[selectedCertificate?.image].map((_) => ({ src: _ }) as LightboxSlide) || []}
          render={{
            iconPrev: () => <Icon icon="solar:alt-arrow-left-outline" width="28" height="28" className="drop-shadow" />,
            iconNext: () => <Icon icon="solar:alt-arrow-right-outline" width="28" height="28" className="drop-shadow" />,
            iconClose: () => <Icon icon="solar:close-circle-outline" width="24" height="24" className="drop-shadow" />
          }}
        />
      </div>
    </section>
  );
};
