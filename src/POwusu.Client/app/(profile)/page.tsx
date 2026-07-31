import { AboutSection } from "@/components/profile/about-section";
import { CertificatesSection } from "@/components/profile/certificates-section";
import { ContactSection } from "@/components/profile/contact-section";
import { ExperienceSection } from "@/components/profile/experience-section";
import { FaqsSection } from "@/components/profile/faqs-section";
import { IntroductionSection } from "@/components/profile/introduction-section";
import { NewsSection } from "@/components/profile/news-section";
import { QuoteSection } from "@/components/profile/quote-section";
import { ScoreSection } from "@/components/profile/score-section";
import { SkillsSection } from "@/components/profile/skills-section";
import { WorksSection } from "@/components/profile/works-section";

export default function HomePage() {
  return (
    <main>
      <IntroductionSection />
      <ScoreSection />
      <AboutSection />
      <ExperienceSection />
      <WorksSection />
      <NewsSection />
      <SkillsSection />
      <CertificatesSection />
      <FaqsSection />
      <QuoteSection />
      <ContactSection />
    </main>
  );
}
