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
  source?: { href: string; label: string };
};

export const siteConfig = {
  name: "Prince Owusu",
  title: "Prince Owusu | Software Engineer",
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
    { label: "Experience", href: "#experience" },
    { label: "News", href: "#news" },
    { label: "Skills", href: "#skills" },
    { label: "Credentials", href: "#credentials" },
    { label: "Contact", href: "#contact" }
  ],
  stats: [
    { value: "10+", label: "shipped products" },
    { value: "9+", label: "years learning in public" },
    { value: "20+", label: "certificates & awards" }
  ],
  experience: [
    {
      id: "hubtel",
      kind: "Professional experience",
      role: "Software Engineer",
      organization: "Hubtel · Accra, Ghana",
      period: "Oct 2023 - Present",
      summary: "Designing, developing, and maintaining dependable internal systems and business-facing workflows.",
      highlights: [
        "Translate operational needs into clear, reliable internal tools.",
        "Collaborate across functions to refine requirements, deliver changes, and improve existing systems."
      ]
    },
    {
      id: "heroui-native",
      kind: "Open source contribution",
      role: "Open Source Contributor",
      organization: "HeroUI Native",
      period: "Sep - Oct 2025",
      summary: "Contributed two merged improvements to HeroUI Native's alpha branch, focused on polished cross-platform mobile interactions and theme consistency.",
      highlights: [
        "Added PressableFeedback with iOS highlight and Android ripple defaults, configurable animation options, examples, and documentation in merged PR #52.",
        "Fixed Stack screen transition backgrounds to respect the active theme, preventing white flashes in dark mode in merged PR #36."
      ],
      links: [
        { label: "Pressable feedback PR #52", href: "https://github.com/heroui-inc/heroui-native/pull/52" },
        { label: "Stack theme fix PR #36", href: "https://github.com/heroui-inc/heroui-native/pull/36" }
      ]
    },
    {
      id: "heroui-native-proposals",
      kind: "Submitted contribution · Closed",
      role: "Mobile UI proposals",
      organization: "HeroUI Native",
      period: "Sep - Oct 2025",
      summary: "Additional interaction and component proposals submitted to HeroUI Native. These pull requests were closed without merging, but document a continued focus on thoughtful mobile feedback.",
      highlights: [
        "Proposed Spinner variants for rotate, sweep, dots, and wave states, tested across sizes and colors in PR #42.",
        "Proposed Button highlight-ripple feedback in PR #44 and a rapid-tap ripple reliability improvement in PR #66."
      ],
      links: [
        { label: "Spinner variants PR #42", href: "https://github.com/heroui-inc/heroui-native/pull/42" },
        { label: "Highlight ripple PR #44", href: "https://github.com/heroui-inc/heroui-native/pull/44" },
        { label: "Ripple reliability PR #66", href: "https://github.com/heroui-inc/heroui-native/pull/66" }
      ]
    },
    {
      id: "storj",
      kind: "Open contribution",
      role: "Contributor",
      organization: "Storj",
      period: "Jul 2025 - Open",
      summary: "An open contribution to Storj Satellite's applications view, addressing category sorting behavior.",
      highlights: [
        "Proposed sorting applications by their first category when category sorting is selected, otherwise by application name.",
        "Targets the application sorting issue tracked in Storj issue #7476."
      ],
      links: [
        { label: "View Storj PR #7527", href: "https://github.com/storj/storj/pull/7527" }
      ]
    },
    {
      id: "community-history",
      kind: "Public contribution history",
      role: "Open-source contributor",
      organization: "Public GitHub projects",
      period: "2022 - 2023",
      summary: "Earlier public contributions spanning community participation and routing ergonomics.",
      highlights: [
        "Merged a contributor-list addition to First Contributions in PR #76687.",
        "Submitted a contextual-routing simplification to next-use-contextual-routing in PR #16; it was closed without merging."
      ],
      links: [
        { label: "First Contributions PR #76687", href: "https://github.com/firstcontributions/first-contributions/pull/76687" },
        { label: "Routing proposal PR #16", href: "https://github.com/toomuchdesign/next-use-contextual-routing/pull/16" }
      ]
    }
  ],
  works: [
    {
      id: "yanioba",
      name: "Yanioba",
      title: "Community Safety App",
      category: "Civic technology",
      description: "A Ghana-focused community safety app for reporting incidents, following local updates, creating alert zones, and staying aware through maps.",
      images: ["/assets/profile/works/yanioba/video-thumbnail.jpg"],
      defaultImage: "/assets/profile/works/yanioba/video-thumbnail.jpg",
      logo: null,
      link: "https://yanioba.vercel.app/",
      stack: ["Community safety", "Maps", "Incident reporting"]
    },
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
  news: [
    {
      id: "academy-ayoba",
      tag: "Milestone",
      date: "2021 · MTN Ayoba Hackathon",
      title: "Academy wins the maiden MTN Ayoba Hackathon",
      description: "TechFocus24 reported that Academy, Prince Owusu’s e-learning app, emerged as the overall winner. The report notes a GHS 20,000 prize and an opportunity to develop the app further with MTN.",
      image: "/assets/profile/news/academy-hackathon-editorial.png",
      link: "https://techfocus24.com/academy-app-wins-2021-mtn-ayoba-hackathon/",
      linkLabel: "Read the report",
      source: "TechFocus24"
    },
    {
      id: "academy-techlabari",
      tag: "Independent coverage",
      date: "2021 · MTN Ayoba Hackathon",
      title: "Prince Owusu wins the 2021 MTN Ayoba Hackathon",
      description: "Tech Labari reported that Academy was named the ultimate winner from 270 applicants. The article highlights the app’s education focus and the support planned to help it grow.",
      image: "/assets/profile/news/academy-learning-editorial.png",
      link: "https://techlabari.com/prince-owusu-wins-2021-mtn-ayoba-hackathon/",
      linkLabel: "Read the coverage",
      source: "Tech Labari"
    }
  ],
  skillGroups: [
    {
      name: "Product interface",
      note: "Web and mobile interfaces that feel clear, intentional, and easy to keep using.",
      skills: [
        { name: "React / Next.js", level: 92, accent: "lilac" },
        { name: "TypeScript", level: 88, accent: "coral" },
        { name: "Design systems", level: 82, accent: "mint" },
        { name: "HTML / CSS", level: 94, accent: "lilac" },
        { name: "React Native", level: 82, accent: "coral" },
        { name: "Expo (Android & iOS)", level: 80, accent: "mint" }
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
    { id: "uopeople", title: "Associate of Science in Computer Science", issuer: "University of the People", year: 2026, category: "Education", document: "/documents/certificates/education/university-of-the-people-associate-of-science-computer-science-2026.pdf", source: { href: "https://www.uopeople.edu/programs/online-associates/computer-science/", label: "Official programme" } },
    { id: "openlabs", title: "Software Development", issuer: "OpenLabs", year: 2024, category: "Education", document: "/documents/certificates/education/openlabs-software-development-2024.pdf", source: { href: "https://openlabs.edu.gh/courses/diploma-in-software-development.php", label: "Official programme" } },
    { id: "codecademy-aspnet", title: "Build Web Apps with ASP.NET Skill Path", issuer: "Codecademy", year: 2023, category: "Technical", document: "/documents/certificates/technical/codecademy-aspnet-2023.pdf", image: "/assets/profile/certificates/Codecademy-Build_Web_Apps_with_ASP.NET_Skill_Path.png", source: { href: "https://www.codecademy.com/learn/paths/build-web-apps-with-asp-net", label: "Official course" } },
    { id: "codecademy-csharp", title: "C#", issuer: "Codecademy", year: 2023, category: "Technical", document: "/documents/certificates/technical/codecademy-csharp-2023.pdf", image: "/assets/profile/certificates/Codecademy-CSharp.png", source: { href: "https://www.codecademy.com/learn/learn-c-sharp", label: "Official course" } },
    { id: "communication", title: "Communication Strategies in a Virtual Age", issuer: "Professional development", year: 2025, category: "Communication", document: "/documents/certificates/communication/communication-strategies-virtual-age-2025.pdf", source: { href: "https://coursera.org/verify/I6NIHMCSXMJ4", label: "Verify credential" } },
    { id: "english", title: "C1 Advanced English", issuer: "Language certification", year: 2024, category: "Communication", document: "/documents/certificates/communication/c1-advanced-english-2024.pdf" },
    { id: "mtn", title: "Winner of the MTN Ayoba Hackathon", issuer: "MTN Ayoba", year: 2021, category: "Recognition", document: "/documents/certificates/recognition/mtn-ayoba-hackathon-2021.pdf", image: "/assets/profile/certificates/Winner_of_MTN_Ayoba_Hackathon_Certificate.png", source: { href: "https://techfocus24.com/academy-app-wins-2021-mtn-ayoba-hackathon/", label: "Read coverage" } },
    { id: "afristid", title: "Innovation Challenge", issuer: "AfriSTI", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/afristid-innovation-challenge-2019.pdf" },
    { id: "technology", title: "Technology, Creativity & Skills Development", issuer: "Technology development programme", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/technology-creativity-skills-2019.pdf", image: "/assets/profile/certificates/Technology_Creativity_and_Skills_Development_Certificate.png" },
    { id: "teenpreneurship", title: "Teenpreneurship", issuer: "Youth entrepreneurship programme", year: 2019, category: "Recognition", document: "/documents/certificates/recognition/teenpreneurship-2019.pdf", source: { href: "https://www.springboard.com.gh/ghana-grows/", label: "Official programme" } },
    { id: "sololearn", title: "C#", issuer: "SoloLearn", year: 2017, category: "Technical", document: "/documents/certificates/technical/sololearn-csharp-2017.pdf", image: "/assets/profile/certificates/Sololearn-CSharp.png", source: { href: "https://www.sololearn.com/learn/courses/c-sharp-introduction", label: "Official course" } },
    { id: "mtn-recognition", title: "Certificate of Recognition", issuer: "MTN Ayoba", year: 2021, category: "Recognition", document: "/documents/certificates/recognition/mtn-ayoba-recognition-2021.pdf", source: { href: "https://techlabari.com/prince-owusu-wins-2021-mtn-ayoba-hackathon/", label: "Read coverage" } },
    { id: "csharp-recognition", title: "C# Certificate", issuer: "SoloLearn", year: 2017, category: "Technical", document: "/documents/certificates/technical/sololearn-csharp-2017.pdf", source: { href: "https://www.sololearn.com/learn/courses/c-sharp-introduction", label: "Official course" } }
  ] satisfies Certificate[],
  faqs: [
    { id: "focus", question: "What kind of work do you do?", answer: "I build full-stack web products, developer tools, and digital experiences with a strong focus on maintainability and the people using them." },
    { id: "stack", question: "What is your core stack?", answer: "C#, .NET, ASP.NET Core, TypeScript, React, Next.js, React Native, Expo, and SQL, together with the supporting practices that make web, Android, and iOS software dependable." },
    { id: "collaboration", question: "How do you like to collaborate?", answer: "I like clear goals, short feedback loops, and enough context to make good decisions. I am comfortable working across product, design, engineering, and QA." },
    { id: "availability", question: "Are you open to new opportunities?", answer: "Yes. I am open to product engineering roles, freelance work, and thoughtful collaborations where craft and impact both matter." }
  ]
};

export type SiteConfig = typeof siteConfig;
