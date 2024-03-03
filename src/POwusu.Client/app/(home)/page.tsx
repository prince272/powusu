import { Link as NextLink } from "@/providers/navigation";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { IntroductionSection } from "@/components/home/introduction-section";
import { ScoreSection } from "@/components/home/score-section";
import { WorksSection } from "@/components/home/works-section";
import { ContactSection } from "@/components/home/contact-section";
import { CertificatesSection } from "@/components/home/certificates-section";

const Home = () => {
  return (
    <>
      <IntroductionSection />
      <ScoreSection />
      <WorksSection />
      <CertificatesSection />
      <ContactSection />
    </>
  );
};

export default Home;
