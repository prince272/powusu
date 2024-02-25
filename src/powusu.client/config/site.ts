export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
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
  projects: [
    {
      id: "neimart",
      title: "Neighborhood Market",
      description: "Neimart is an e-commerce platform that provides an end-to-end business solution allowing you to start, grow, and manage your retail business.",
      images: [
        "/assets/profile/projects/neimart/1.png",
        "/assets/profile/projects/neimart/2.png",
        "/assets/profile/projects/neimart/3.png",
        "/assets/profile/projects/neimart/4.png"
      ],
      defaultImage: "/assets/profile/projects/neimart/1.png",
      logo: "/assets/profile/projects/neimart/logo.png",
      link: "https://github.com/prince272/neimart"
    },
    {
      id: "academy",
      title: "Academy Of Ours",
      description: "Academy of Ours is an e-learning platform that helps you to learn a variety of courses and concepts through interactive checkpoints, lessons, and videos with certificates awarded automatically after each course.",
      images: [
        "/assets/profile/projects/academy/1.png",
        "/assets/profile/projects/academy/2.png",
        "/assets/profile/projects/academy/3.png",
        "/assets/profile/projects/academy/4.png"
      ],
      defaultImage: "/assets/profile/projects/academy/1.png",
      logo: "/assets/profile/projects/academy/logo.png",
      link: "https://github.com/prince272/academy"
    },
    {
      id: "precious",
      title: "Precious Assistant",
      description: "Precious is digital life assistant that allows you to interact with your computer 24 hours a day, 7 days in a week. Just tell it to find content, get answers, play music, and connect with friends and friends. It works seamlessly with many popular desktops applications and has very friendly disposition.",
      images: [
        "/assets/profile/projects/precious/1.png",
        "/assets/profile/projects/precious/2.png",
        "/assets/profile/projects/precious/3.png"
      ],
      defaultImage: "/assets/profile/projects/precious/1.png",
      logo: "/assets/profile/projects/precious/logo.png",
      link: "https://github.com/prince272/precious-assistant"
    }
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
  }
};

export const SiteConfig = typeof siteConfig;