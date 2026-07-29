export type SkillGroup = {
  name: string;
  note: string;
  skills: { name: string; level: number; accent: "lilac" | "coral" | "mint" }[];
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: number;
  category: "Education" | "Technical" | "Recognition" | "Communication";
  document: string;
  image?: string;
};

export const siteConfig = {
  name: "Prince Owusu",
  title: "Prince Owusu — Software Engineer",
  titleTemplate: "%s · Prince Owusu",
  description:
    "Prince Owusu is a Ghana-based software engineer building thoughtful, dependable products with .NET, TypeScript, React, and Next.js.",
  location: "Accra, Ghana",
  availability: "Open to product engineering and thoughtful collaborations",
  cv: "/documents/cv/prince-owusu-cv.pdf",
  profileImage: "/assets/profile/1.png",
  links: {
    github: "https://github.com/prince272",
    linkedin: "https://www.linkedin.com/in/prince-owusu-799438108",
    twitter: "https://twitter.com/OwusuPrince272",
    whatsapp: "https://api.whatsapp.com/send?phone=233550362337&text=Let%27s%20connect.",
    email: "mailto:princeowusu.272@gmail.com"
  },
  navItems: [
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Credentials", href: "#credentials" },
    { label: "Contact", href: "#contact" }
  ],
  stats: [
    { value: "10+", label: "shipped products" },
    { value: "9+", label: "years learning in public" },
    { value: "20+", label: "certificates & awards" }
  ],
  works: [
    {
      id: "neimart",
      name: "Neimart",
      title: "Neighborhood Market",
      category: "Commerce platform",
      description: "An end-to-end retail platform for starting, growing, and managing a neighborhood business.",
      images: ["/assets/profile/works/neimart/1.png", "/assets/profile/works/neimart/2.png", "/assets/profile/works/neimart/3.png"],
      defaultImage: "/assets/profile/works/neimart/1.png",
      logo: "/assets/profile/works/neimart/logo.png",
      link: "https://github.com/prince272/neimart",
      stack: ["Next.js", "TypeScript", ".NET", "PostgreSQL"]
    },
    {
      id: "academy",
      name: "Academy",
      title: "Academy Of Ours",
      category: "Learning platform",
      description: "An interactive learning experience built around lessons, checkpoints, video, and automatic certificates.",
      images: ["/assets/profile/works/academy/1.png", "/assets/profile/works/academy/2.png", "/assets/profile/works/academy/3.png"],
      defaultImage: "/assets/profile/works/academy/1.png",
      logo: "/assets/profile/works/academy/logo.png",
      link: "https://github.com/prince272/academy",
      stack: ["React", "TypeScript", "Tailwind CSS", "Video"]
    },
    {
      id: "nextsolution",
      name: "NextSolution",
      title: "NextSolution.Template",
      category: "Developer tooling",
      description: "A reusable starter that pairs an ASP.NET API with a polished Next.js frontend for shipping faster.",
      images: ["/assets/profile/works/nextsolution/1.png", "/assets/profile/works/nextsolution/2.png"],
      defaultImage: "/assets/profile/works/nextsolution/1.png",
      logo: "/assets/profile/works/nextsolution/logo.png",
      link: "https://www.nuget.org/packages/NextSolution.Template",
      stack: ["ASP.NET Core", "Next.js", "Docker", "NuGet"]
    },
    {
      id: "precious",
      name: "Precious",
      title: "Precious Assistant",
      category: "Desktop assistant",
      description: "A friendly digital assistant for finding content, getting answers, playing music, and connecting with people.",
      images: ["/assets/profile/works/precious/1.png", "/assets/profile/works/precious/2.png"],
      defaultImage: "/assets/profile/works/precious/1.png",
      logo: "/assets/profile/works/precious/logo.png",
      link: "https://github.com/prince272/precious-assistant",
      stack: ["C#", ".NET", "Desktop", "Automation"]
    }
  ],
  skillGroups: [
    {
      name: "Product interface",
      note: "Interfaces that feel clear, intentional, and easy to keep using.",
      skills: [
        { name: "React / Next.js", level: 92, accent: "lilac" },
        { name: "TypeScript", level: 88, accent: "coral" },
        { name: "Design systems", level: 82, accent: "mint" },
        { name: "HTML / CSS", level: 94, accent: "lilac" }
      ]
    },
    {
      name: "Reliable systems",
      note: "Strong foundations for APIs, data, auth, and the work behind the screen.",
      skills: [
        { name: "C# / .NET", level: 94, accent: "coral" },
        { name: "ASP.NET Core", level: 90, accent: "mint" },
        { name: "SQL / data modeling", level: 83, accent: "lilac" },
        { name: "Testing & QA", level: 80, accent: "coral" }
      ]
    },
    {
      name: "Shipping toolkit",
      note: "Practical tools that keep delivery visible, repeatable, and calm.",
      skills: [
        { name: "Git / GitHub", level: 92, accent: "mint" },
        { name: "Azure & deployment", level: 74, accent: "coral" },
        { name: "Postman / APIs", level: 88, accent: "lilac" },
        { name: "Technical writing", level: 84, accent: "mint" }
      ]
    }
  ] satisfies SkillGroup[],
  certificates: [
    { id: "uopeople", title: "Associate of Science in Computer Science", issuer: "University of the People", year: 2026, category: "Education", document: "/documents/certificates/education/university-of-the-people-associate-of-science-computer-science-2026.pdf" },
    { id: "openlabs", title: "Software Development", issuer: "OpenLabs", year: 2024, category: "Education", document: "/documents/certificates/education/openlabs-software-development-2024.pdf" },
    { id: "codecademy-aspnet", title: "Build Web Apps with ASP.NET Skill Path", issuer: "Codecademy", year: 2023, category: "Technical", document: "/documents/certificates/technical/codecademy-aspnet-2023.pdf", image: "/assets/profile/certificates/Codecademy-Build_Web_Apps_with_ASP.NET_Skill_Path.png" },
    { id: "codecademy-csharp", title: "C#", issuer: "Codecademy", year: 2023, category: "Technical", document: "/documents/certificates/technical/codecademy-csharp-2023.pdf", image: "/assets/profile/certificates/Codecademy-CSharp.png" },
    { id: "communication", title: "Communication Strategies in a Virtual Age", issuer: "Professional development", year: 2025, category: "Communication", document: "/documents/certificates/communication/communication-strategies-virtual-age-2025.pdf" },
    { id: "english", title: "C1 Advanced English", issuer: "Language certification", year: 2024, category: "Communication", document: "/documents/certificates/communication/c1-advanced-english-2024.pdf" },
    { id: "mtn", title: "Winner of the MTN Ayoba Hackathon", issuer: "MTN Ayoba", year: 2021, category: "Recognition", document: "/documents/certificates/recognition/mtn-ayoba-hackathon-2021.pdf", image: "/assets/profile/certificates/Winner_of_MTN_Ayoba_Hackathon_Certificate.png" },
    { id: "afristid", title: "Innovation Challenge", issuer: "AfriSTI", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/afristid-innovation-challenge-2019.pdf" },
    { id: "technology", title: "Technology, Creativity & Skills Development", issuer: "Technology development programme", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/technology-creativity-skills-2019.pdf", image: "/assets/profile/certificates/Technology_Creativity_and_Skills_Development_Certificate.png" },
    { id: "teenpreneurship", title: "Teenpreneurship", issuer: "Youth entrepreneurship programme", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/teenpreneurship-2019.pdf" },
    { id: "sololearn", title: "C#", issuer: "SoloLearn", year: 2017, category: "Technical", document: "/documents/certificates/technical/sololearn-csharp-2017.pdf", image: "/assets/profile/certificates/Sololearn-CSharp.png" },
    { id: "mtn-recognition", title: "Certificate of Recognition", issuer: "MTN Ayoba", year: 2021, category: "Recognition", document: "/documents/certificates/recognition/mtn-ayoba-recognition-2021.pdf" },
    { id: "csharp-recognition", title: "C# Certificate", issuer: "SoloLearn", year: 2017, category: "Technical", document: "/documents/certificates/technical/sololearn-csharp-2017.pdf" }
  ] satisfies Certificate[],
  faqs: [
    { id: "focus", question: "What kind of work do you do?", answer: "I build full-stack web products, developer tools, and digital experiences with a strong focus on maintainability and the people using them." },
    { id: "stack", question: "What is your core stack?", answer: "C#, .NET, ASP.NET Core, TypeScript, React, Next.js, SQL, and the supporting practices that make software dependable." },
    { id: "collaboration", question: "How do you like to collaborate?", answer: "I like clear goals, short feedback loops, and enough context to make good decisions. I am comfortable working across product, design, engineering, and QA." },
    { id: "availability", question: "Are you open to new opportunities?", answer: "Yes. I am open to product engineering roles, freelance work, and thoughtful collaborations where craft and impact both matter." }
  ]
};

export type SiteConfig = typeof siteConfig;
