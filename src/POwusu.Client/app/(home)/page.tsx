import { Link as NextLink } from "@/providers/navigation";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { IntroSection } from "@/components/home/intro-section";
import { ScoreSection } from "@/components/home/score-section";
import { ProjectsSection } from "@/components/home/projects-section";

const Home = () => {
  return (
    <>
      <IntroSection />
      <ScoreSection />
      <ProjectsSection />
    </>
  );
};

export default Home;
