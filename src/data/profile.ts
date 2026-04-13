export type Locale = "en" | "ru";

export interface ProfileSection {
  title: string;
  body: string;
}

export interface ProfileContent {
  locale: Locale;
  siteTitle: string;
  siteDescription: string;
  heroTitle: string;
  heroSummary: string;
  navAbout: string;
  footerTagline: string;
  switchLanguageLabel: string;
  homeSections: ProfileSection[];
  aboutTitle: string;
  aboutDescription: string;
  aboutIntro: string[];
  aboutSections: Array<{
    title: string;
    items: string[];
  }>;
  contactTitle: string;
  contacts: Array<{
    label: string;
    href: string;
    text: string;
  }>;
}

export const profileContent: Record<Locale, ProfileContent> = {
  en: {
    locale: "en",
    siteTitle: "Nikita Borisov",
    siteDescription:
      "SRE/DevOps engineer focused on cloud infrastructure, reliability, automation, and practical AI adoption.",
    heroTitle: "Nikita Borisov",
    heroSummary:
      "I am an SRE/DevOps engineer working on cloud infrastructure in a large Russian bank. This site is my professional profile and blog, where I write about reliability, platform engineering, automation, and practical ways AI can improve day-to-day engineering work.",
    navAbout: "About",
    footerTagline:
      "Nikita Borisov. SRE/DevOps engineer writing about infrastructure, automation, and AI.",
    switchLanguageLabel: "Русский",
    homeSections: [
      {
        title: "Current Role",
        body: "I work with cloud infrastructure and day-to-day reliability engineering tasks in a large banking environment, where stability, observability, and operational discipline matter.",
      },
      {
        title: "Core Stack",
        body: "My working toolbox spans Linux administration, observability practices, databases, automation, and the surrounding SRE/DevOps ecosystem needed to keep services running predictably.",
      },
      {
        title: "Engineering Approach",
        body: "I do not position myself as a narrow specialist in a single technology. My strength is understanding enough of the full stack to connect systems, automate routine work, and move toward practical solutions.",
      },
      {
        title: "AI and Automation",
        body: "Alongside my main role, I am actively exploring how AI can be used in engineering automation in a practical way: saving time, reducing repetitive work, and helping navigate complex systems faster.",
      },
      {
        title: "Community",
        body: "Outside of work I take part in hackathons, CTFs, and other technical activities that reward fast learning, experimentation, and problem-solving under time pressure.",
      },
      {
        title: "Contacts",
        body: "You can reach me through GitHub, LinkedIn, Telegram, or email. I am open to professional conversations, collaboration, and sharing notes from real infrastructure work.",
      },
    ],
    aboutTitle: "About",
    aboutDescription: "Background, stack, and professional interests of Nikita Borisov.",
    aboutIntro: [
      "My name is Nikita Borisov, and I often go by Nik in English-speaking contexts.",
      "I have more than 1.5 years of industry experience and currently work as an SRE/DevOps engineer focused on cloud infrastructure in a large Russian bank.",
    ],
    aboutSections: [
      {
        title: "What I Do",
        items: [
          "Work with infrastructure reliability, operational routines, and engineering support around production systems.",
          "Handle a broad SRE/DevOps stack rather than a single narrow domain.",
          "Focus on solutions that are practical, maintainable, and useful for the team.",
        ],
      },
      {
        title: "What I Work With",
        items: [
          "Linux server administration and day-to-day platform operations.",
          "Observability tooling, monitoring practices, and database-related work.",
          "Basic programming in Python, C++, and Bash for automation and internal tools.",
        ],
      },
      {
        title: "Current Interests",
        items: [
          "Applying AI to engineering automation in ways that save time and reduce repetitive manual work.",
          "Building a stronger understanding of systems beyond my immediate responsibilities.",
          "Turning small scripts and experiments into useful workflow improvements.",
        ],
      },
      {
        title: "Beyond Work",
        items: [
          "Participate in hackathons, CTF events, and other technical competitions.",
          "Enjoy fast feedback loops, hands-on problem solving, and learning by doing.",
        ],
      },
    ],
    contactTitle: "Contact",
    contacts: [
      { label: "GitHub", href: "https://github.com/yemmi17", text: "github.com/yemmi17" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nikita-borisov-34b1b9381/",
        text: "nikita-borisov-34b1b9381",
      },
      { label: "Telegram", href: "https://t.me/Yemmi0", text: "@Yemmi0" },
      {
        label: "Email",
        href: "mailto:nikitabrworkjob@gmail.com",
        text: "nikitabrworkjob@gmail.com",
      },
    ],
  },
  ru: {
    locale: "ru",
    siteTitle: "Nikita Borisov",
    siteDescription:
      "SRE/DevOps engineer облачной инфраструктуры. Пишу о надежности систем, автоматизации и практическом применении AI.",
    heroTitle: "Nikita Borisov",
    heroSummary:
      "Я SRE/DevOps engineer облачной инфраструктуры в крупном российском банке. Здесь собран мой профессиональный профиль и блог о надежности систем, платформенной инженерии, автоматизации и практическом применении AI в повседневной работе.",
    navAbout: "Обо мне",
    footerTagline:
      "Nikita Borisov. SRE/DevOps engineer, заметки об инфраструктуре, автоматизации и AI.",
    switchLanguageLabel: "English",
    homeSections: [
      {
        title: "Текущая роль",
        body: "Работаю с облачной инфраструктурой и задачами reliability engineering в крупной банковской среде, где особенно важны стабильность, observability и аккуратные эксплуатационные процессы.",
      },
      {
        title: "Рабочий стек",
        body: "Хорошо ориентируюсь в рабочем наборе SRE/DevOps: Linux-администрирование, observability, базы данных, автоматизация и другие инструменты, необходимые для поддержки production-сервисов.",
      },
      {
        title: "Подход к инженерии",
        body: "Я не позиционирую себя как узкого специалиста в одной технологии. Моя сильная сторона в том, что я вижу картину целиком, быстро связываю разные части стека и собираю из них практичные решения.",
      },
      {
        title: "AI и автоматизация",
        body: "Помимо основного профиля, активно изучаю, как AI может помогать в инженерной автоматизации: экономить время, сокращать ручные действия и ускорять разбор сложных систем.",
      },
      {
        title: "Сообщество и практика",
        body: "Участвую в хакатонах, CTF и других технических активностях, где важны скорость обучения, экспериментирование и умение решать задачи в ограниченное время.",
      },
      {
        title: "Контакты",
        body: "Для связи доступны GitHub, LinkedIn, Telegram и email. Открыт к профессиональному общению, совместным проектам и обмену практическим опытом.",
      },
    ],
    aboutTitle: "Обо мне",
    aboutDescription: "Коротко обо мне, моем опыте, рабочем стеке и профессиональных интересах.",
    aboutIntro: [
      "Меня зовут Никита Борисов. В англоязычной среде обычно использую имя Nik.",
      "У меня более 1.5 лет опыта в индустрии, и сейчас я работаю SRE/DevOps engineer облачной инфраструктуры в крупном российском банке.",
    ],
    aboutSections: [
      {
        title: "Чем я занимаюсь",
        items: [
          "Работаю с надежностью инфраструктуры, эксплуатационными процессами и инженерной поддержкой production-систем.",
          "Закрываю широкий круг SRE/DevOps-задач, а не только одну узкую область.",
          "Стараюсь делать решения практичными, поддерживаемыми и полезными для команды.",
        ],
      },
      {
        title: "С чем я работаю",
        items: [
          "Администрирование Linux-серверов и повседневные платформенные задачи.",
          "Observability-инструменты, мониторинг и работа с базами данных.",
          "Базовая разработка на Python, C++ и Bash для автоматизации и небольших внутренних инструментов.",
        ],
      },
      {
        title: "Что мне сейчас интересно",
        items: [
          "Применение AI в инженерной автоматизации без хайпа, а как реального рабочего инструмента.",
          "Расширение системного кругозора за пределами своей текущей зоны ответственности.",
          "Превращение небольших скриптов и экспериментов в полезные улучшения повседневных процессов.",
        ],
      },
      {
        title: "Помимо работы",
        items: [
          "Участвую в хакатонах, CTF и других технических соревнованиях.",
          "Люблю среду, где можно быстро учиться, проверять гипотезы и решать задачи руками.",
        ],
      },
    ],
    contactTitle: "Контакты",
    contacts: [
      { label: "GitHub", href: "https://github.com/yemmi17", text: "github.com/yemmi17" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nikita-borisov-34b1b9381/",
        text: "nikita-borisov-34b1b9381",
      },
      { label: "Telegram", href: "https://t.me/Yemmi0", text: "@Yemmi0" },
      {
        label: "Email",
        href: "mailto:nikitabrworkjob@gmail.com",
        text: "nikitabrworkjob@gmail.com",
      },
    ],
  },
};
