export const modules = [
  {
    id: 'intro',
    title: 'Why Chat Isn’t Enough',
    description: 'Learn why the single-thread model of ChatGPT hits a ceiling in professional marketing.',
    icon: 'Terminal',
    unlocked: true,
  },
  {
    id: 'threads',
    title: 'Parallel Threads and Worktrees',
    description: 'Master the art of running multiple campaign operations simultaneously.',
    icon: 'Layers',
    unlocked: false,
  },
  {
    id: 'skills',
    title: 'Skills: Reusable Playbooks',
    description: 'Turn your agency prompt library into scalable, executable skills.',
    icon: 'BookOpen',
    unlocked: false,
  },
  {
    id: 'automations',
    title: 'Automations on Autopilot',
    description: 'Set up the 5 core automations that every agentic agency needs.',
    icon: 'Zap',
    unlocked: false,
  },
  {
    id: 'computer-use',
    title: 'Computer Use',
    description: 'When the agent takes the wheel of your browser and desktop apps.',
    icon: 'MousePointer2',
    unlocked: false,
  },
  {
    id: 'intelligence',
    title: 'Plugins and Browser Research',
    description: 'Connecting your agent to the live web and your marketing stack.',
    icon: 'Globe',
    unlocked: false,
  },
  {
    id: 'memory',
    title: 'Memory and Personalization',
    description: 'How to ensure agents never forget a client choice or brand voice.',
    icon: 'Brain',
    unlocked: false,
  },
  {
    id: 'orchestration',
    title: 'Multi-Agent Workflows',
    description: 'Coordinating a team of specialists to handle complex projects.',
    icon: 'Users',
    unlocked: false,
  },
  {
    id: 'governance',
    title: 'Governance and Approvals',
    description: 'Scaling with safety: knowing when to approve and when to block.',
    icon: 'ShieldCheck',
    unlocked: false,
  },
  {
    id: 'plan',
    title: 'First 30 Days Agentic Plan',
    description: 'Your final roadmap to transitioning a real agency to an agentic model.',
    icon: 'Calendar',
    unlocked: false,
  },
];

export const scenarios = {
  monday_morning: {
    title: "Monday Morning: 47 Tabs Open",
    description: "It is 8:00 AM in Vilnius. Your coffee is cooling. You have GA4, Search Console, Meta Ads, HubSpot, and 43 other tabs open. Two reports are due by 11:00 AM.",
    choices: [
      {
        id: 'manual',
        text: "Keep working manually",
        outcome: "You spend 3 hours copy-pasting data. The reports are 'good enough', but you're exhausted and behind on strategy.",
        isAgentic: false,
      },
      {
        id: 'agentic',
        text: "Start orchestrating agents",
        outcome: "You trigger your Monday Morning Digest automation. Within minutes, you have a status report skeleton and anomaly alerts ready for review.",
        isAgentic: true,
      }
    ]
  }
};
