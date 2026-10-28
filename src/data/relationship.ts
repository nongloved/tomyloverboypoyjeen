// Site content (text only — photos/songs live in the DB, see lib/content.ts).
// Exports relationshipData and its field types (TimelineEntry, MuseumItem,
// Song, QuizQuestion, OpenWhenCard, ReflectiveCard, LoveCategory, WatchedItem).

export type TimelineEntry = {
  date: string;
  title: string;
  caption: string;
  // one slot can hold a few photos — the gallery stacks them like real
  // polaroids when there's more than one
  photos: (string | null)[];
};

export type MuseumItem = {
  photo: string | null;
  caption: string;
};

export type Song = {
  role: string;
  title: string;
  artist: string;
  cover: string | null;
  note: string;
  url?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  response: string;
};

export type OpenWhenCard = {
  label: string;
  message: string;
  tone: "warm" | "calm" | "playful" | "reassuring";
};

export type ReflectiveCard = {
  title: string;
  message: string;
};

export type LoveCategory = {
  category: string;
  items: string[];
};

export type WatchedItem = {
  platform: "netflix" | "hbomax" | "disneyplus" | "primevideo" | "other";
  title: string;
  poster?: string | null;
  // EDIT: paste the watch link here (Netflix/etc share link) if you want one
  url?: string;
};

export const relationshipData = {
  him: "Poyjeen",

  mbti: {
    her: "INTJ-A",
    him: "ENFJ-A",
  },

  ageGapNote: "Poy is one year younger.",
  metOn: "Coffee Meets Bagel",

  // when the talking stage started
  startDate: "2026-04-24",
  // the day it became official
  officialDate: "2026-09-25",

  theme:
    "We didn't become us in one moment. We became us through hundreds of little moments.",

  // EDIT: paste a Spotify playlist share link here — powers the floating
  // music player (bottom-right on every page). Leave empty to hide it.
  backgroundPlaylistUrl: "https://open.spotify.com/playlist/5t9cQzQtnlCqjeDHD2ZNdn?si=OlvAZO1nTQCULWPG5NqY2Q&utm_source=copy-link&pi=OsjfIKD7ReGIM",

  opening: {
    addressee: "Poyjeen",
    subheading: "open when you're ready",
  },

  // shown on the back of the postcard once it's flipped open
  firstLetter: {
    greeting: "Hi Poyjeen,",
    paragraphs: [
      "I made you something.",
      "",
      "It's not finished. It's not supposed to be — we're not finished either.",
      "So... let's go back to the beginning.",
    ],
    cta: "Start from the beginning →",
  },

  howWeMet: {
    title: "How it started",
    date: "24 April",
    // kept for reference / the quiz later — just not announced up front here
    metOn: "Coffee Meets Bagel",
    lead: "Our first conversation started on 24 April...",
    steps: [
      "We started talking.",
      "You were apparently flirting with me.",
      "I somehow didn't realize.",
      "And then... five months happened.",
    ],
    flirtPrompt: "Wait... you were flirting with me?",
    flirtReveal: "Yes.\nYou just didn't know it yet. 🤭",
    // real context, for her to weave into the writing later if she wants
    context:
      "During the talking stage, Poy was subtly testing the waters. She didn't fully realize it at the time — she grew interested slowly, mostly because of how he thought through complicated things: emotional without losing logic.",
  },

  museum: {
    intro: "A tiny museum of us",
  },

  // sensory triggers — things she sees, hears, smells, etc. that make her
  // think of him, not just memories of specific moments
  memoryJar: [
    "[ADD A SOUND — a song, a word, a ringtone — that makes you think of him]",
    "[ADD A SMELL OR TASTE that reminds you of him]",
    "[ADD SOMETHING YOU SEE OFTEN that makes you think of him]",
    "[ADD A PLACE that reminds you of him even when he's not there]",
    "[ADD A TIME OF DAY OR SITUATION that makes you miss him]",
    "[ADD ANYTHING ELSE THAT REMINDS YOU OF HIM]",
  ],

  thingsILove: [
    {
      category: "Physiological",
      items: [
        "Hygiene (u smell guuudd)",
        "u got some taste in fashion (makes u handsome)",
        "(could be) photogenic figure",
        "voices (talk, sing whatever)",
        "hands (idk maybe cuz yours is bigger than mine)",
        "looks like cinamonroll would kill other ppl for me lol",
      ],
    },
    {
      category: "Psychological",
      items: [
        "lil bit small talk, big deep talk",
        "opened mind opened heart",
        "lowkey lover boy",
        "responsible",
        "sincere",
        "try to understand",
      ],
    },
    {
      category: "Behavioral",
      items: [
        "start conversation first",
        "oversharing over-listening",
        "be willing to adjust when you express your needs.",
        "willing to spend time together.",
      ],
    },
    {
      category: "Emotional",
      items: [
        "I feel comfortable being with",
        "wanna hug when tired",
        "look forward to telling u about my day",
        "feel cared for",
        "wanna spend time with you",
        "can be myself",
      ],
    },
  ] satisfies LoveCategory[],

  quiz: [
    {
      question: "Where did we first meet?",
      options: ["Tinder", "Instagram", "Coffee Meets Bagel", "Fate™"],
      correctIndex: 2,
      response: "C ♡ — obviously.",
    },
    {
      question: "Who was flirting first?",
      options: ["Me", "You", "Both", "Still under investigation"],
      correctIndex: 1,
      response: "You. You just won't admit it. 🤭",
    },
    {
      question: "How long did we talk before it became official?",
      options: ["2 weeks", "5 months", "1 year", "We're still just talking"],
      correctIndex: 1,
      response: "5 months. Slow, but worth it.",
    },
    {
      question: "Who's younger?",
      options: ["Me", "You", "Same age", "Classified"],
      correctIndex: 1,
      response: "You are — by one year.",
    },
    {
      question: "What's my MBTI?",
      options: ["INTJ-A", "ENFJ-A", "INFP-T", "ESTP-A"],
      correctIndex: 0,
      response: "INTJ-A. Cold outside, soft for you inside.",
    },
    {
      question: "What's your MBTI?",
      options: ["INTJ-A", "ENFJ-A", "ISTJ-T", "ENTP-A"],
      correctIndex: 1,
      response: "ENFJ-A. Emotional and logical at once — kind of the whole point of this site.",
    },
  ] satisfies QuizQuestion[],

  openWhen: [
    { label: "Open when you miss me", tone: "warm", message: "[ADD MESSAGE HERE]" },
    { label: "Open when you had a bad day", tone: "reassuring", message: "[ADD MESSAGE HERE]" },
    { label: "Open when you can't sleep", tone: "calm", message: "[ADD MESSAGE HERE]" },
    { label: "Open when you need a reminder that I love you", tone: "warm", message: "[ADD MESSAGE HERE]" },
    { label: "Open when we had a silly fight", tone: "reassuring", message: "[ADD MESSAGE HERE — encourage talking it out, not guilt]" },
    { label: "Open when you want to see me", tone: "playful", message: "[ADD MESSAGE / PHOTO HERE]" },
    { label: "Open when you feel like you're not doing enough", tone: "reassuring", message: "[ADD MESSAGE HERE]" },
  ] satisfies OpenWhenCard[],

  voiceMessage: {
    src: "/audio/voice-message.mp3", // EDIT: drop your recording at public/audio/voice-message.mp3
    before: "press play when you're ready",
    after: "okay... that's enough emotional damage for one day.",
  },

  secret: {
    // EDIT: change this. keep it something only he'd know (a date, an inside joke, a word).
    password: "changeme",
    passwordHint: "[ADD A SMALL HINT HERE, IF YOU WANT ONE]",
    teaser: "You thought that was everything?",
    cta: "one last thing →",
    unlockedIntro: "Okay.\nThis one is just for you.",
    letter: "[ADD YOUR MOST PERSONAL / SECRET LETTER HERE]",
  },

  finalLetter: {
    heading: "This isn't the end of our story.",
    paragraphs: [
      "It's just the part I've written down so far.",
      "There are still so many firsts left for us.",
      "More places. More photos. More stupid jokes. More ordinary days that somehow become my favorite days.",
      "So...",
    ],
    question: "let's keep going?",
    cta: "YES ♡",
    officialDateDisplay: "25 September 2026",
  },

  // the anniversary gift reveal — comes right after "let's keep going?" on
  // the final letter, before "things I haven't told you yet"
  giftReveal: {
    paragraphs: [
      "Every photo you just looked back through? I only managed to catch some of them.",
      "So for our anniversary, I got you something to help catch the rest.",
    ],
    closeEyesPrompt: "close your eyes for a second...",
    // shown on the back of the card once it's tapped
    backParagraphs: [
      "I got you a something, **a charmera**. Just for catching us. Every blurry laugh, every random moments, every first we haven't had yet. So we never have to rely on just our phones for the next first.",
      "Happy first anniversary. Let's keep collecting these.",
    ],
    cta: "let's keep going →",
  },

  notToldYouYet: [
    { title: "Something I realized after meeting you", message: "[ADD MESSAGE HERE]" },
    { title: "A moment you probably don't know was important to me", message: "[ADD MESSAGE HERE]" },
    { title: "Something I secretly find cute about you", message: "[ADD MESSAGE HERE]" },
    { title: "Something I want to do with you someday", message: "[ADD MESSAGE HERE]" },
    { title: "Something I hope we'll remember years from now", message: "[ADD MESSAGE HERE]" },
  ] satisfies ReflectiveCard[],

  futureMemories: [
    "A place we haven't visited yet",
    "A photo we haven't taken yet",
    "A food we haven't tried yet",
    "A stupid inside joke we haven't created yet",
    "A day we haven't had yet",
    "A memory we haven't made yet",
  ],
};

export type RelationshipData = typeof relationshipData;
