"use client";

import NextLink from "next/link";
import ProgrammingIllustration from "@/assets/illustrations/programming.svg";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";

import { siteConfig } from "@/config/site";

import { Icon } from "../ui/icon";

export const SkillsSection = () => {
  return (
    <section id="contact" className="bg-default-50 py-24">
      <div className="container relative mx-auto max-w-screen-xl">
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
              <ProgrammingIllustration className="max-h-[384px] animate-updown text-default-50" width="100%" height="100%" preserveAspectRatio="none" />
            </div>
          </div>
          <div className="md:order-0 order-1 col-span-12 md:col-span-7">
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Frontend</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content="React.js">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:react" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Next.js">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:nextjs-icon" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Bootstrap">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:bootstrap" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Material UI">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:material-ui" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Html">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:html-5" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="CSS">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:css-3" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Javascript">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:javascript" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Typescript">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:typescript-icon" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JQuery">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:jquery-wordmark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Tailwind CSS">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:tailwindcss-icon" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Backend</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content=".NET">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:dotnet" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="C#">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:csharp" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="MySQL">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:mysql" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Postgres SQL">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:postgresql" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Sqllite">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:sqlite-wordmark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Mongo DB">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:mongodb-wordmark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Elastic Search">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="skill-icons:elasticsearch-dark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Kafka">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="skill-icons:kafka" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Sql Server">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon-plain:microsoftsqlserver-wordmark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JWT authentication">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:jwt-icon" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-medium uppercase tracking-tight">Tools</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <Tooltip content="Visual Studio">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:visual-studio" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Visual Studio Code">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:visual-studio-code" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Rider">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:rider" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JetBrains">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:jetbrains" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Postman">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:postman-icon" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Git">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:git" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Github">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="skill-icons:github-dark" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="TFS">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="file-icons:tfs" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="Azure">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="devicon:azure" width="32" height="32" />
                  </CardBody>
                </Card>
              </Tooltip>
              <Tooltip content="JWT authentication">
                <Card className="bg-background">
                  <CardBody className="p-2">
                    <Icon className="rounded-md" icon="logos:jwt-icon" width="32" height="32" />
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
