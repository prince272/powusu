import { AboutSection } from "@/components/profile/about-section";
import { CertificatesSection } from "@/components/profile/certificates-section";
import { ContactSection } from "@/components/profile/contact-section";
import { FaqsSection } from "@/components/profile/faqs-section";
import { IntroductionSection } from "@/components/profile/introduction-section";
import { QuoteSection } from "@/components/profile/quote-section";
import { ScoreSection } from "@/components/profile/score-section";
import { SkillsSection } from "@/components/profile/skills-section";
import { WorksSection } from "@/components/profile/works-section";
import { PlateEditor } from "@/components/ui/editor/plate-editor";

const Home = () => {
  return (
    <>
      <IntroductionSection />
      <ScoreSection />
      <WorksSection />
      <CertificatesSection />
      <SkillsSection />
      <FaqsSection />
      <QuoteSection />
      <ContactSection />
    </>
  );
};

export default Home;
