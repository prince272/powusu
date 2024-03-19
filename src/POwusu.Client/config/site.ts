export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Prince Owusu",
  title: "Prince Owusu",
  titleTemplate: "%s - Prince Owusu",
  description: "I am a highly skilled Software Engineer with a passion for crafting seamless user experiences. I specialize in developing end-to-end applications that not only meet requirements, but exceed user expectations.",
  navItems: [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Blog",
      href: "/blog"
    }
  ],
  works: [
    {
      id: "b13273c2-2af7-4f8e-961f-8d4871f2730e",
      title: "Neighborhood Market",
      name: "Neimart",
      description: "Neimart is an e-commerce platform that provides an end-to-end business solution allowing you to start, grow, and manage your retail business.",
      images: ["/assets/profile/works/neimart/1.png", "/assets/profile/works/neimart/2.png", "/assets/profile/works/neimart/3.png", "/assets/profile/works/neimart/4.png"],
      defaultImage: "/assets/profile/works/neimart/1.png",
      logo: "/assets/profile/works/neimart/logo.png",
      link: "https://github.com/prince272/neimart"
    },
    {
      id: "e56e2db9-7a49-45d4-bd67-fda3997c92a0",
      title: "Academy Of Ours",
      name: "Academy",
      description:
        "Academy of Ours is an e-learning platform that helps you to learn a variety of courses and concepts through interactive checkpoints, lessons, and videos with certificates awarded automatically after each course.",
      images: ["/assets/profile/works/academy/1.png", "/assets/profile/works/academy/2.png", "/assets/profile/works/academy/3.png", "/assets/profile/works/academy/4.png"],
      defaultImage: "/assets/profile/works/academy/1.png",
      logo: "/assets/profile/works/academy/logo.png",
      link: "https://github.com/prince272/academy"
    },
    {
      id: "28bc8642-3c75-4f29-b312-9b5183e605ab",
      title: "NextSolution.Template",
      name: "NextSolution",
      description:
        "NextSolution is a template that brings together an ASP.NET API backend and a Next.js frontend. This combination offers the benefits of a robust backend with ASP.NET and a responsive, interactive frontend using Next.js.",
      images: ["/assets/profile/works/nextsolution/1.png", "/assets/profile/works/nextsolution/2.png", "/assets/profile/works/nextsolution/3.png"],
      defaultImage: "/assets/profile/works/nextsolution/1.png",
      logo: "/assets/profile/works/nextsolution/logo.png",
      link: "https://www.nuget.org/packages/NextSolution.Template"
    },
    {
      id: "40ff2d5a-1f2f-4f5b-80f6-8351a17d7889",
      title: "Precious Assistant",
      name: "Precious",
      description:
        "Precious is digital life assistant that allows you to interact with your computer 24 hours a day, 7 days in a week. Just tell it to find content, get answers, play music, and connect with friends and friends. It works seamlessly with many popular desktops applications and has very friendly disposition.",
      images: ["/assets/profile/works/precious/1.png", "/assets/profile/works/precious/2.png", "/assets/profile/works/precious/3.png"],
      defaultImage: "/assets/profile/works/precious/1.png",
      logo: "/assets/profile/works/precious/logo.png",
      link: "https://github.com/prince272/precious-assistant"
    }
  ],
  certificates: [
    {
      id: "756b048a-8c32-4c94-bd39-dc15a5f7a89f",
      title: "Winner of MTN Ayoba Hackathon Certificate",
      image: "/assets/profile/certificates/Winner_of_MTN_Ayoba_Hackathon_Certificate.png",
      document: "/assets/profile/certificates/Winner_of_MTN_Ayoba_Hackathon_Certificate.pdf",
      year: 2021
    },
    {
      id: "a2f0e7e9-16d5-4cb8-98a5-813e5c0732d7",
      title: "African Science and Technical Development Certificate",
      image: "/assets/profile/certificates/African_Science_and_Technical_Development_Certificate.png",
      document: "/assets/profile/certificates/African_Science_and_Technical_Development_Certificate.pdf",
      year: 2019
    },
    {
      id: "b70e9980-7e88-48a3-9a83-4a2b0d08d374",
      title: "Codecademy - C#",
      image: "/assets/profile/certificates/Codecademy-CSharp.png",
      document: "/assets/profile/certificates/Codecademy-CSharp.pdf",
      year: 2023
    },
    {
      id: "ed0296f7-b438-4b2b-9c06-97914a7ec161",
      title: "Codecademy - Build Web Apps with ASP.NET Skill Path",
      image: "/assets/profile/certificates/Codecademy-Build_Web_Apps_with_ASP.NET_Skill_Path.png",
      document: "/assets/profile/certificates/Codecademy-Build_Web_Apps_with_ASP.NET_Skill_Path.pdf",
      year: 2023
    },
    {
      id: "356e2cf4-4274-4aeb-9779-39ca20f91226",
      title: "Sololearn - C#",
      image: "/assets/profile/certificates/Sololearn-CSharp.png",
      document: "/assets/profile/certificates/Sololearn-CSharp.pdf",
      year: 2017
    },
    {
      id: "5fd688ac-6a91-4958-8041-2106d1d308d2",
      title: "Technology, Creativity & Skills Development Certificate",
      image: "/assets/profile/certificates/Technology_Creativity_and_Skills_Development_Certificate.png",
      document: "/assets/profile/certificates/Technology_Creativity_and_Skills_Development_Certificate.pdf",
      year: 2019
    }
  ],
  links: {
    github: "https://github.com/prince272",
    twitter: "https://twitter.com/OwusuPrince272",
    whatsapp: "https://api.whatsapp.com/send?phone=233550362337&text=Let%27s%20connect.",
    linkedin: "https://www.linkedin.com/in/prince-owusu-799438108",
    telegram: "https://t.me/princeowusu272",
    stackoverflow: "https://stackoverflow.com/users/5265873/prince-owusu"
  },
  faqs: [
    {
      id: "1",
      question: "What drives you as a software engineer?",
      answer:
        "As a software engineer, I am driven by a passion for innovation and problem solving, constantly pushing the boundaries of technology. With a diverse set of skills and a commitment to generating amazing results, I am dedicated to creating solutions that create meaningful change. My journey in software engineering has been driven by a relentless pursuit of knowledge and a desire to make a positive impact on the world."
    },
    {
      id: "2",
      question: "What programming languages and frameworks are you proficient in?",
      answer: "I am skilled in a variety of languages and frameworks including:\n- C#, .NET, ASP.NET\n- React.js, Next.js\n- JavaScript, TypeScript\n- HTML, CSS\nand more."
    },
    {
      id: "3",
      question: "Can you describe your experience in software development?",
      answer:
        "Certainly, I have worked extensively as a software engineer focusing on full-stack web application development, emphasizing scalability and maintainability.\n\nI have a strong background in software engineering principles and continually stay updated with new technological advancements."
    },
    {
      id: "4",
      question: "What are some of your core capabilities?",
      answer:
        "I possess strong critical thinking skills and creativity.\nI have excellent communication and interpersonal abilities.\nI can multitask and meet deadlines efficiently.\nI am highly adaptable to new challenges and environments."
    },
    {
      id: "5",
      question: "What has been your work experience?",
      answer:
        "I worked as a Software Engineer, where I:\n\n- Coordinated end-to-end unit testing and post-production testing with QA testers.\n- Created new features and integrated them into the legacy system application.\n- Showed great expertise in designing and implementing an ERP solution, enhancing operational efficiency and data management capabilities.\n\nAdditionally, I worked as a Freelance Full-Stack Developer, building websites and web applications for various clients."
    },
    {
      id: "6",
      question: "What are your hobbies?",
      answer:
        "Playing video games, whether casually or competitively, is a way for me to enjoy.\n\nListening to music emotive lyrics and experimental sounds creating a tapestry of musical depth and resonance."
    },
    {
      id: "7",
      question: "What is your relationship status?",
      answer: "As of now, I am single. I am open to meeting new people and making new friends."
    },
    {
      id: "8",
      question: "What is your favorite food?",
      answer:
        "My favorite food is Fufu and Light Soup. Fufu, made from boiled and pounded cassava and plantains, is often served with a flavorful soup, typically light soup, which contains ingredients such as tomatoes, onions, chili peppers, and various meats or fish."
    },
    {
      id: "14",
      question: "What certificates have you achieved?",
      get answer(): string {
        return "I have achieved several certificates. Here are some of them:\n\n" + siteConfig.certificates.map((cert) => `- ${cert.title}`).join("\n");
      }
    },
    {
      id: "15",
      question: "What are your social media links?",
      get answer(): string {
        return (
          "You can connect with me on the following social media platforms:\n\n" +
          Object.entries(siteConfig.links)
            .map(([key, value]) => `- ${key}`)
            .join("\n")
        );
      }
    },
    {
      id: "16",
      question: "What are your works?",
      get answer(): string {
        return "I have worked on several projects. Here are some of them:\n\n" + siteConfig.works.map((work) => `- ${work.title}`).join("\n");
      }
    },
    {
      id: "9",
      question: "What is your age?",
      get answer(): string {
        const currentDate = new Date();
        const birthDate = new Date(1999, 6, 15);
        const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
        const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
        const ageInYears = Math.floor(ageInMilliseconds / millisecondsInYear);
        const ageInMonths = Math.floor((ageInMilliseconds % millisecondsInYear) / (millisecondsInYear / 12));
        const ageInDays = Math.floor((ageInMilliseconds % (millisecondsInYear / 12)) / (1000 * 60 * 60 * 24));
        
        const currentDateString = `${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        
        return `As of ${currentDateString}, I am ${ageInYears} years, ${ageInMonths} months, and ${ageInDays} days old.`;
    }
    }
  ]
};

export const SiteConfig = typeof siteConfig;
