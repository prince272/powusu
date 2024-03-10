import { PlateEditor } from "@/components/plate-ui";
import { AboutSection } from "@/components/profile/about-section";
import { CertificatesSection } from "@/components/profile/certificates-section";
import { ContactSection } from "@/components/profile/contact-section";
import { IntroductionSection } from "@/components/profile/introduction-section";
import { QuoteSection } from "@/components/profile/quote-section";
import { ScoreSection } from "@/components/profile/score-section";
import { SkillsSection } from "@/components/profile/skills-section";
import { WorksSection } from "@/components/profile/works-section";

const Home = () => {
  return (
    <>
      <IntroductionSection />
      <ScoreSection />
      <WorksSection />
      <CertificatesSection />
      <SkillsSection />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <PlateEditor />
    </>
  );
};

export default Home;
