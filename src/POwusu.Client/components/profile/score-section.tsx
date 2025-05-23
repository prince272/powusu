"use client";

import SolarChatSquareCodeBold from "@iconify/icons-solar/chat-square-code-bold";
import SolarCheckCircleBold from "@iconify/icons-solar/check-circle-bold";
import SolarClockCircleBold from "@iconify/icons-solar/clock-circle-bold";
import SolarStarShineBold from "@iconify/icons-solar/star-shine-bold";
import { Card, CardBody } from "@heroui/card";
import CountUp from "react-countup";

import { Icon } from "@/components/ui/icon";

export const ScoreSection = () => {
  return (
    <section id="score" className="z-10 -mt-24 pb-20 pt-10">
      <div className="relative mx-auto max-w-screen-xl px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <Card className="bg-background/70 p-4 backdrop-blur-lg backdrop-saturate-150">
            <CardBody className="flex flex-col items-center justify-center">
              <Icon icon={SolarCheckCircleBold} width={72} height={72} className="mb-3 text-primary" />
              <div className="text-center">
                <h3 className="mb-3 text-3xl font-bold">
                  <CountUp duration={10} end={20} />
                  <span className="align-top text-xl">+</span>
                </h3>
                <p className="text-sm text-default-500">Works Completed</p>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-background/70 p-4 backdrop-blur-lg backdrop-saturate-150">
            <CardBody className="flex flex-col items-center justify-center">
              <Icon icon={SolarChatSquareCodeBold} width={72} height={72} className="mb-3 text-secondary" />
              <div className="text-center">
                <h3 className="mb-3 text-3xl font-bold">
                  <CountUp duration={10} end={1859.9} />
                  <span className="align-top text-xl">K</span>
                </h3>
                <p className="text-sm text-default-500">Lines of Code</p>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-background/70 p-4 backdrop-blur-lg backdrop-saturate-150">
            <CardBody className="flex flex-col items-center justify-center">
              <Icon icon={SolarClockCircleBold} width={72} height={72} className="mb-3 text-primary" />
              <div className="text-center">
                <h3 className="mb-3 text-3xl font-bold">
                  <CountUp duration={10} end={4} />
                  <span className="align-top text-xl">yrs+</span>
                </h3>
                <p className="text-sm text-default-500">Coding Experience</p>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-background/70 p-4 backdrop-blur-lg backdrop-saturate-150">
            <CardBody className="flex flex-col items-center justify-center">
              <Icon icon={SolarStarShineBold} width={72} height={72} className="mb-3 text-secondary" />
              <div className="text-center">
                <h3 className="mb-3 text-3xl font-bold">
                  <CountUp duration={10} end={100} />
                  <span className="align-top text-xl">%</span>
                </h3>
                <p className="text-sm text-default-500">Satisfaction Guarantee</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};
