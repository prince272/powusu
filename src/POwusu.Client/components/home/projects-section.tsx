"use client";

// import "swiper/css";
import { useMemo, useState } from "react";
import { Link as NextLink } from "@/providers/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Pagination as SwiperPagination } from "swiper/modules";
import Lightbox, { Slide as LightboxSlide } from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/pagination";

import { cn } from "@/utils";
import { Swiper, SwiperSlide } from "swiper/react";

import { SiteConfig, siteConfig } from "@/config/site";

import { Icon } from "../ui/icon";

export const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<SiteConfig["projects"][0] | null>(null);

  return (
    <section id="projects" className="bg-default-50 pb-24 pt-8">
      <div className="container relative mx-auto flex flex-col items-center justify-center">
        <div className="flex max-w-xl flex-col text-center">
          <h2 className="mb-1 font-medium text-primary">Projects</h2>
          <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
            Featured <span className="text-secondary">Projects</span>
          </h1>
          <h2 className="mb-3 text-default-500">Explore my passion, creativity, and growth.</h2>
        </div>
        <Swiper
          wrapperClass="mb-14"
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${cn(className, "!w-3 !h-3 [&.swiper-pagination-bullet-active]:!bg-primary [&.swiper-pagination-bullet]:bg-default-300 !opacity-100")}"></span>`;
            }
          }}
          modules={[SwiperPagination]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20
            }
          }}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          className="flex w-full"
        >
          {siteConfig.projects.map((project, index) => (
            <SwiperSlide key={project.id} virtualIndex={index}>
              <Card className="flex flex-col gap-4 bg-background">
                <CardHeader className="relative pb-0" onClick={() => setSelectedProject(project)}>
                  <div className="group relative">
                    <Image removeWrapper alt={project.title} className="aspect-[4/3] rounded-xl object-cover object-center" src={project.defaultImage} />
                    <div className="absolute top-0 z-20 h-full w-full flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button size="lg" color="primary" onPress={() => setSelectedProject(project)}>
                        Preview
                      </Button>
                    </div>
                  </div>
                  <Image
                    classNames={{ wrapper: "absolute bottom-0 right-0 z-10 mb-2 mr-6 bg-white p-2 rounded-full shadow" }}
                    width={64}
                    height={64}
                    src={project.logo}
                    alt={`${project.title} Logo`}
                  />
                </CardHeader>
                <CardBody className="relative pt-0">
                  <h3 className="mb-1 line-clamp-1 text-large font-bold text-primary">{project.title}</h3>
                  <p className="mb-3 line-clamp-3 h-[72px] text-default-500">{project.description}</p>
                  <Button
                    as={NextLink}
                    href={project.link}
                    target="_blank"
                    variant="flat"
                    color="default"
                    fullWidth
                    startContent={<Icon icon="solar:link-outline" width={24} height={24} />}
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
          open={!!selectedProject}
          close={() => setSelectedProject(null)}
          slides={selectedProject?.images.map((image) => ({ src: image }) as LightboxSlide) || []}
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
