import { type Author } from "@/types";

export const initialData: Author[] = [
  {
    id: "author-1",
    name: "Alex Johnson",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-1-1",
        description: "Develop the new landing page design",
        priority: "High",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Initial wireframes are attached. Focus on mobile-first design.",
        subtasks: [
          { id: "sub-1-1-1", description: "Create navigation component", completed: true },
          { id: "sub-1-1-2", description: "Design hero section", completed: false },
          { id: "sub-1-1-3", description: "Add testimonials section", completed: false },
          { id: "sub-1-1-4", description: "Implement contact form", completed: false },
        ],
      },
      {
        id: "task-1-2",
        description: "API Integration for user authentication",
        priority: "High",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Use OAuth 2.0. Documentation is available on Confluence.",
        subtasks: [],
      },
    ],
  },
  {
    id: "author-2",
    name: "Maria Garcia",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-2-1",
        description: "Quarterly Marketing Report Analysis",
        priority: "Medium",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Analyze Q2 performance data and create a presentation for the board meeting.",
        subtasks: [
          { id: "sub-2-1-1", description: "Gather social media metrics", completed: true },
          { id: "sub-2-1-2", description: "Analyze email campaign results", completed: true },
          { id: "sub-2-1-3", description: "Summarize findings in a deck", completed: false },
          { id: "sub-2-1-4", description: "Schedule review meeting", completed: false },
        ],
      },
    ],
  },
  {
    id: "author-3",
    name: "Chen Wei",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-3-1",
        description: "Refactor legacy database schema",
        priority: "High",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "There is a performance bottleneck in the user table. Need to normalize it.",
        subtasks: [
            { id: "sub-3-1-1", description: "Backup current database", completed: false },
            { id: "sub-3-1-2", description: "Write migration scripts", completed: false },
            { id: "sub-3-1-3", description: "Test migration on staging", completed: false },
            { id: "sub-3-1-4", description: "Deploy to production", completed: false },
        ],
      },
    ],
  },
  {
    id: "author-4",
    name: "Fatima Al-Fassi",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-4-1",
        description: "Organize company offsite event",
        priority: "Medium",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Location TBD. Budget is $10,000.",
        subtasks: [
            { id: "sub-4-1-1", description: "Survey team for preferences", completed: true },
            { id: "sub-4-1-2", description: "Research and book venue", completed: false },
            { id: "sub-4-1-3", description: "Plan activities and agenda", completed: false },
            { id: "sub-4-1-4", description: "Arrange travel and accommodation", completed: false },
        ],
      },
    ],
  },
  {
    id: "author-5",
    name: "David Smith",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-5-1",
        description: "User testing for the new mobile app",
        priority: "Low",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Recruit 10 participants. Prepare testing scripts.",
        subtasks: [
            { id: "sub-5-1-1", description: "Finalize participant criteria", completed: true },
            { id: "sub-5-1-2", description: "Create test scenarios", completed: false },
            { id: "sub-5-1-3", description: "Conduct testing sessions", completed: false },
            { id: "sub-5-1-4", description: "Synthesize feedback into report", completed: false },
        ],
      },
    ],
  },
  {
    id: "author-6",
    name: "Yuki Tanaka",
    avatar: "https://placehold.co/100x100.png",
    tasks: [
      {
        id: "task-6-1",
        description: "Update third-party dependencies",
        priority: "Low",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Check for breaking changes before updating. Run all tests after.",
        subtasks: [
            { id: "sub-6-1-1", description: "Audit outdated packages", completed: false },
            { id: "sub-6-1-2", description: "Update packages one by one", completed: false },
            { id: "sub-6-1-3", description: "Run regression tests", completed: false },
            { id: "sub-6-1-4", description: "Merge changes to main branch", completed: false },
        ],
      },
       {
        id: "task-6-2",
        description: "Write documentation for new feature",
        priority: "Medium",
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Cover both user guide and API reference.",
        subtasks: [],
      },
    ],
  },
];
