"use client";

import NextLink from "next/link";
import ProgrammingIllustration from "@/assets/illustrations/programming.svg";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";

import { siteConfig } from "@/config/site";

import { Icon } from "@/components/ui/icon";

import LogosReact from "@iconify-icons/logos/react";
import LogosNextjsIcon from "@iconify-icons/logos/nextjs-icon";
import LogosBootstrap from "@iconify-icons/logos/bootstrap";
import LogosMaterialUi from "@iconify-icons/logos/material-ui";
import LogosHtml5 from "@iconify-icons/logos/html-5";
import LogosCss3 from "@iconify-icons/logos/css-3";
import LogosJavascript from "@iconify-icons/logos/javascript";
import LogosTypescriptIcon from "@iconify-icons/logos/typescript-icon";
import LogosJquery from "@iconify-icons/logos/jquery";
import LogosTailwindcssIcon from "@iconify-icons/logos/tailwindcss-icon";
import SimpleIconsNextui from "@iconify-icons/simple-icons/nextui";
import LogosDotnet from "@iconify-icons/logos/dotnet";
import DeviconCsharp from "@iconify/icons-devicon/csharp";
import LogosMysql from "@iconify-icons/logos/mysql";
import LogosPostgresql from "@iconify-icons/logos/postgresql";
import DeviconSqliteWordmark from "@iconify/icons-devicon/sqlite-wordmark";
import DeviconMongodbWordmark from "@iconify/icons-devicon/mongodb-wordmark";
import DeviconElasticsearch from "@iconify/icons-devicon/elasticsearch";
import DeviconApachekafka from "@iconify/icons-devicon/apachekafka";
import LogosJwtIcon from "@iconify-icons/logos/jwt-icon";
import LogosVisualStudio from "@iconify-icons/logos/visual-studio";
import LogosVisualStudioCode from "@iconify-icons/logos/visual-studio-code";
import LogosRider from "@iconify-icons/logos/rider";
import DeviconJetbrains from "@iconify/icons-devicon/jetbrains";
import LogosPostmanIcon from "@iconify-icons/logos/postman-icon";
import DeviconGit from "@iconify/icons-devicon/git";
import DeviconGithubWordmark from "@iconify/icons-devicon/github-wordmark";
import FileIconsTfs from "@iconify-icons/file-icons/tfs";
import LogosMicrosoftAzure from "@iconify-icons/logos/microsoft-azure";


export const SkillsSection = () => {
  return (
    <section id="contact" className="bg-default-50 py-24">
      <div className="relative mx-auto max-w-screen-xl px-6">
        <div className="mb-6 flex justify-center">
          <div className="flex max-w-xl flex-col text-center">
            <h2 className="mb-1 font-medium text-primary">Skills</h2>
            <h1 className="mb-3 font-heading text-4xl font-medium uppercase tracking-tight">
              Specialized <span className="text-secondary">Skills</span>
            </h1>
            <h2 className="mb-3 text-default-500">Tap into my specialized skills - let&apos;s create something remarkable.</h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="relative col-span-12 md:col-span-5">
            <div className="flex aspect-[4/3] justify-center">
              <ProgrammingIllustration className="max-h-[384px] animate-updown text-default-50 w-auto" width="100%" height="100%" preserveAspectRatio="none" />
            </div>
          </div>
          <div className="md:order-0 order-1 col-span-12 md:col-span-7">
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Frontend</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content="React.js">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosReact} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Next.js">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosNextjsIcon} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Bootstrap">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosBootstrap} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Material UI">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosMaterialUi} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Html">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosHtml5} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="CSS">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosCss3} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Javascript">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosJavascript} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Typescript">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosTypescriptIcon} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JQuery">
                <Card className="bg-white text-black">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosJquery} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Tailwind CSS">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosTailwindcssIcon} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Next UI">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={SimpleIconsNextui} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Backend</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content=".NET">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosDotnet} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="C#">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconCsharp} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="MySQL">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosMysql} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Postgres SQL">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosPostgresql} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Sqllite">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconSqliteWordmark} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Mongo DB">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconMongodbWordmark} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Elastic Search">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconElasticsearch} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Kafka">
                <Card className="bg-white text-black">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconApachekafka} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Sql Server">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconSqliteWordmark} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JWT authentication">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosJwtIcon} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Tools</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content="Visual Studio">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosVisualStudio} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Visual Studio Code">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosVisualStudioCode} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Rider">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosRider} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JetBrains">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconJetbrains} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Postman">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosPostmanIcon} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Git">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconGit} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Github">
                <Card className="bg-white text-black">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={DeviconGithubWordmark} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Azure">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon={LogosMicrosoftAzure} width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
