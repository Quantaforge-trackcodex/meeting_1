import { Workspace, AITask, SecurityAlert, Repository, LiveSession, ProfileData, LibraryResource, LibraryCategory, Job, Organization, Candidate, TrialRepo, GrowthPathItem, SkillRadarData, OnboardingTask } from './types';

export const MOCK_REPOS: Repository[] = [
  {
    id: 'trackcodex-backend',
    name: 'trackcodex-backend',
    description: 'Core API service for the **TrackCodex** platform handling `user authentication`, repository indexing, and AI analysis queuing. Check out the [API docs](#/repo/trackcodex-backend).',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Go',
    techColor: '#00add8',
    stars: 24,
    forks: 5,
    aiHealth: 'A+',
    aiHealthLabel: 'Excellent',
    securityStatus: 'Passing',
    lastUpdated: '2h ago',
    contributors: ['https://picsum.photos/seed/u1/32', 'https://picsum.photos/seed/u2/32', 'https://picsum.photos/seed/u3/32'],
    languages: [
      { name: 'Go', percentage: 85, color: '#00add8' },
      { name: 'TypeScript', percentage: 15, color: '#3178c6' }
    ],
    refactors: [
      { id: '1', type: 'Complexity', description: 'The `processData` function in `utils.ts` has a cyclomatic complexity of 24.', target: 'utils.ts' },
      { id: '2', type: 'Modernization', description: "Convert 'var' declarations to 'const' in legacy module `auth.js`.", target: 'auth.js' }
    ],
    releaseVersion: 'v2.4.0'
  },
  {
    id: 'dashboard-ui',
    name: 'dashboard-ui',
    description: '*React-based* frontend for the main dashboard including all charting components, collaborative tools, and `AI insights`.',
    isPublic: true,
    visibility: 'PUBLIC',
    techStack: 'TypeScript',
    techColor: '#3178c6',
    stars: 142,
    forks: 38,
    aiHealth: 'B',
    aiHealthLabel: 'Good',
    securityStatus: '2 Issues',
    lastUpdated: '15m ago'
  },
  {
    id: 'documentation-site',
    name: 'documentation-site',
    description: 'Public facing documentation built with _Docusaurus_. Contains guides, [API reference](#), and platform architecture docs.',
    isPublic: true,
    visibility: 'PUBLIC',
    techStack: 'Markdown',
    techColor: '#f97316',
    stars: 89,
    forks: 12,
    aiHealth: 'A++',
    aiHealthLabel: 'Perfect',
    securityStatus: 'Passing',
    lastUpdated: '3d ago'
  },
  {
    id: 'legacy-importer',
    name: 'legacy-importer',
    description: 'Scripts to migrate data from the old SVN system. Currently in maintenance mode for enterprise legacy clients.',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Python',
    techColor: '#facc15',
    stars: 2,
    forks: 0,
    aiHealth: 'C-',
    aiHealthLabel: 'Poor',
    securityStatus: 'Unchecked',
    lastUpdated: '1mo ago'
  },
  {
    id: 'mobile-app-flutter',
    name: 'mobile-app-flutter',
    description: 'Cross-platform mobile application for field agents. Integrated with camera and real-time sync via WebSocket.',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Dart',
    techColor: '#0ea5e9',
    stars: 18,
    forks: 3,
    aiHealth: 'A',
    aiHealthLabel: 'Great',
    securityStatus: 'Passing',
    lastUpdated: '5h ago'
  }
];

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'trackcodex-backend',
    name: 'track-api-prod',
    status: 'Running',
    runtime: 'Node 20.x',
    lastModified: '2m ago',
    repo: 'trackcodex/core-engine',
    branch: 'main',
    commit: 'f29a1d4',
    collaborators: ['https://picsum.photos/seed/1/32', 'https://picsum.photos/seed/2/32']
  },
  {
    id: 'dashboard-ui',
    name: 'ui-stage',
    status: 'Stopped',
    runtime: 'React 18',
    lastModified: '1d ago',
    repo: 'trackcodex/dashboard-ui',
    branch: 'develop',
    commit: 'a1b2c3d',
    collaborators: ['https://picsum.photos/seed/3/32']
  }
];

export const MOCK_AI_TASKS: AITask[] = [
  { id: '1', taskName: 'Refactor Auth Controller', fileName: 'auth_module.ts', model: 'Claude 3.5 Sonnet', result: 'Diff Generated', timestamp: '2 mins ago' }
];

export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'FIND-9023', severity: 'Critical', vulnerability: 'SQL Injection in User Login', repository: 'auth-service-api', status: 'Open' }
];

export const MOCK_SESSIONS: LiveSession[] = [
  { id: 's1', title: 'Debugging Auth Module', project: 'api-gateway-v3', host: 'Sarah Chen', hostAvatar: 'https://picsum.photos/seed/sarah/64', viewers: 12, participants: 8 },
];

export const MOCK_PROFILE: ProfileData = {
  name: 'Alex Chen',
  username: 'alexcoder',
  avatar: 'https://picsum.photos/seed/alexprofile/400',
  bio: 'Security-first developer specializing in Rust and cryptographic systems. 🛡️',
  followers: '2.4k',
  following: 180,
  company: 'TrackCodex Security',
  location: 'Seattle, WA',
  website: 'alexchen.security',
  rating: '4.9/5',
  pinnedRepos: [
    {
      name: 'rust-crypto-guard',
      description: 'High-performance cryptographic primitives for secure communication channels.',
      language: 'Rust',
      langColor: '#f97316',
      stars: '1.2k',
      forks: 142,
      isPublic: true
    }
  ]
};

export const MOCK_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'secure-auth-api',
    name: 'secure-auth-api',
    description: 'JWT-based authentication server with CSRF protection, rate limiting, and secure cookie handling pre-configured.',
    longDescription: 'A production-ready authentication server implementation featuring JWT-based stateless authentication, CSRF protection, and rate limiting out of the box. Designed to drop into any Express.js microservice architecture. Includes pre-configured secure cookie handling and PII redaction for logs.',
    category: 'Backend API',
    techStack: 'TypeScript',
    techColor: '#3178c6',
    stars: 4800,
    forks: 1200,
    lastUpdated: '2 days ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Template',
    tags: ['JWT', 'OAuth2', 'Express'],
    version: 'v2.4.1',
    snippetPreview: `import express from 'express';\nimport { rateLimit } from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});\n\napp.use(limiter);`
  },
  {
    id: 'dashboard-pro-kit',
    name: 'Enterprise Dashboard UI Kit & Prompt',
    description: 'A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards.',
    longDescription: 'A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards. Optimized for financial and analytics workloads with pre-built accessibility features.',
    category: 'UI & Design',
    techStack: 'Tailwind CSS',
    techColor: '#06b6d4',
    stars: 5200,
    forks: 1400,
    lastUpdated: '2 days ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Kit',
    tags: ['React', 'Dashboard'],
    version: 'v2.4.0',
    snippetPreview: `Generate a responsive {{DashboardType}} layout using CSS Grid.\nInclude a sidebar navigation with {{NavItems}} items.\nThe main content area should feature:\n1. A summary cards row displaying {{KPI_Metrics}}.\n...`
  }
];

export const MOCK_LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: 'backend-api', name: 'Backend API', icon: 'api', count: 12 },
  { id: 'ui-design', name: 'UI & Design', icon: 'design_services', count: 4 }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'DeFi Protocol Security Audit',
    description: 'Perform a comprehensive security audit on our upcoming DeFi lending protocol built on Solana.',
    longDescription: 'We are seeking a senior security engineer to perform a 2-week intensive audit of our Solana smart contracts. Focus areas include liquidations logic, oracle integration, and flash loan prevention. You will be working directly with our lead developer in a dedicated workspace.',
    budget: '$8,500',
    type: 'Contract',
    status: 'Open',
    techStack: ['Rust', 'Solana', 'Security'],
    repoId: 'trackcodex-backend',
    creator: {
      name: 'SolanaLend Team',
      avatar: 'https://picsum.photos/seed/solana/64'
    },
    postedDate: '2 hours ago'
  },
  {
    id: 'job-2',
    title: 'React Performance Optimization',
    description: 'Optimize a data-heavy analytics dashboard to reduce bundle size and improve TTI.',
    longDescription: 'Our main dashboard has grown too complex. We need a React expert to implement code-splitting, optimize memoization, and refactor expensive computations to web workers. The project uses Recharts and Tailwind CSS.',
    budget: '$3,200',
    type: 'Gig',
    status: 'In Progress',
    techStack: ['React', 'TypeScript', 'Performance'],
    repoId: 'dashboard-ui',
    creator: {
      name: 'AnalyticsPro',
      avatar: 'https://picsum.photos/seed/analytics/64'
    },
    postedDate: 'Yesterday'
  },
];

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'quantaforge',
    name: 'Quantaforge',
    avatar: 'https://picsum.photos/seed/quantaforge/200',
    description: 'Building the next generation of developer tools with a focus on security, performance, and AI-driven insights.',
    website: 'quantaforge.io',
    location: 'San Francisco, CA',
    repositories: MOCK_REPOS.slice(0, 3),
    members: [
      { username: 'alexcoder', name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alexprofile/64', role: 'Owner', lastActive: '2 hours ago' },
      { username: 'sarah_backend', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64', role: 'Admin', lastActive: '15 minutes ago' },
      { username: 'm_thorne', name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/64', role: 'Member', lastActive: 'Yesterday' },
      { username: 'david_kim', name: 'David Kim', avatar: 'https://picsum.photos/seed/david/64', role: 'Member', lastActive: '3 days ago' },
    ],
    teams: [
      { id: 't1', name: 'Core Infrastructure', description: 'Manages the core backend services and platform infrastructure.', memberCount: 8, repoCount: 2 },
      { id: 't2', name: 'Frontend Guild', description: 'Maintains all user-facing applications and design systems.', memberCount: 12, repoCount: 4 },
      { id: 't3', name: 'ForgeAI Research', description: 'R&D for the ForgeAI engine and related services.', memberCount: 5, repoCount: 1 },
    ],
  }
];

// --- NEW HIRING & GROWTH MOCK DATA ---

export const MOCK_CANDIDATES: Candidate[] = [
    { 
        id: 'jane-doe', 
        name: 'Jane Doe', 
        role: 'Senior Software Engineer Applicant',
        location: 'San Francisco, CA',
        avatar: 'https://picsum.photos/seed/janedoe/64', 
        aiComplexityScore: 92,
        codeReplayUrl: '#',
        techScore: 94,
        cultureFit: 88,
        complexity: 'High',
        experience: '8y+',
        technicalEvidence: [
            { title: 'Refactored Middleware Logic', description: 'Replaced nested callbacks with clean async/await patterns and error handlers.', complexity: 94, quality: 96, timestamp: '00:42:16' },
            { title: 'Database Schema Optimization', description: 'Identified and fixed a critical N+1 query issue in the data fetching layer.', complexity: 88, quality: 92, timestamp: '01:16:02' }
        ],
        linesChanged: { added: 482, removed: 24 },
        testingCoverage: 92,
        maintainability: 'A+',
        qualitativeNotes: [
            { author: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64', rating: 5, note: 'Deep understanding of distributed systems. She just didn’t solve the coding prompt, she discussed architectural tradeoffs for production.', tags: ['Architecture', 'Leadership'], strengths: ['Highly articulate about technical tradeoffs', 'Proactive mentoring mindset'], potentials: ['Limited experience with Kubernetes'] }
        ]
    },
    { 
        id: 'alex-chen', 
        name: 'Alex Chen', 
        role: 'Staff Engineer @ TechFlow',
        avatar: 'https://picsum.photos/seed/alexchen/64', 
        aiComplexityScore: 88,
        aiComplexityDepth: 'High Depth',
        codeReplayUrl: '#',
        prQuality: 94,
        status: 'Top Match',
        codeReplayHighlights: ['Refactored with logic from O(n) to O(1) during live session.'],
        interviewerSentiment: 4.8,
        techStackMatch: [{ skill: 'Go', alignment: 95 }, { skill: 'K8s', alignment: 80 }, { skill: 'Redis', alignment: 98 }],
        trialPRLink: '#402',
        decision: 'Extend Offer'
    },
    { 
        id: 'sarah-smith', 
        name: 'Sarah Smith', 
        role: 'Sr. Backend @ Cloudscale',
        avatar: 'https://picsum.photos/seed/sarahsmith/64', 
        aiComplexityScore: 94,
        aiComplexityDepth: 'Elite',
        codeReplayUrl: '#',
        prQuality: 92,
        status: 'Passing',
        codeReplayHighlights: ['Optimized Postgres queries with intelligent indexing.', 'Integrated Redis caching for hot path calls.'],
        interviewerSentiment: 4.9,
        techStackMatch: [{ skill: 'Go', alignment: 100 }, { skill: 'K8s', alignment: 90 }, { skill: 'Redis', alignment: 95 }],
        trialPRLink: '#415',
        decision: 'Schedule Final'
    },
     { 
        id: 'jordan-lee', 
        name: 'Jordan Lee', 
        role: 'Lead Dev @ DataPulse',
        avatar: 'https://picsum.photos/seed/jordanlee/64', 
        aiComplexityScore: 85,
        aiComplexityDepth: 'Standard',
        codeReplayUrl: '#',
        prQuality: 88,
        status: 'Archived',
        codeReplayHighlights: ['Followed standard MVC patterns consistently.'],
        interviewerSentiment: 3.8,
        techStackMatch: [{ skill: 'Go', alignment: 80 }, { skill: 'Docker', alignment: 90 }],
        trialPRLink: '#389',
        decision: 'Archive'
    }
];


export const MOCK_TRIAL_REPOS: TrialRepo[] = [
    {
        id: 'trial-1',
        title: 'Senior Backend Engineer',
        company: 'Stripe',
        location: 'Remote, Global',
        salaryRange: '$180k - $240k',
        status: 'Newly Active',
        description: 'Refactor the Rate Limiter in the Go SDK',
        challenges: ['Implement a fixed window strategy for traffic management.', 'Ensure zero-downtime and maintain backwards compatibility.'],
        tech: ['Go', 'Redis', 'gRPC'],
        deployments: 12,
        coverage: 98,
        avgPrReview: '45m',
        logo: 'https://cdn.worldvectorlogo.com/logos/stripe-2.svg',
    },
    {
        id: 'trial-2',
        title: 'Core Systems Engineer',
        company: 'Vercel',
        location: 'SF / Remote',
        salaryRange: '$200k - $280k',
        status: 'Updated',
        description: 'Optimize Edge Function Cold Starts via WASM',
        challenges: ['Analyze current boot times using internal telemetry.', 'Implement a pre-warming strategy for WASM modules in the Edge Runtime.'],
        tech: ['Rust', 'WASM', 'Node.js'],
        deployments: 8,
        coverage: 99,
        avgPrReview: '15m',
        logo: 'https://cdn.worldvectorlogo.com/logos/vercel.svg',
    },
    {
        id: 'trial-3',
        title: 'Platform Engineer (K8s)',
        company: 'Monzo',
        location: 'London / Remote',
        salaryRange: '£110k - £160k',
        status: 'Updated',
        description: 'Hardening Multi-cluster mTLS Auth',
        challenges: ['Identify and fix a race condition in the Istio-based certificate rotation service.', 'Improve observability by adding Prometheus metrics.'],
        tech: ['Kubernetes', 'AWS', 'Istio'],
        deployments: 4,
        coverage: 100,
        avgPrReview: '2h',
        logo: 'https://cdn.worldvectorlogo.com/logos/monzo-2.svg',
    },
];

export const MOCK_GROWTH_DATA = {
    skillRadar: [
        { subject: 'System Design', score: 85, fullMark: 100 },
        { subject: 'Frontend', score: 70, fullMark: 100 },
        { subject: 'Backend', score: 90, fullMark: 100 },
        { subject: 'Security', score: 95, fullMark: 100 },
        { subject: 'Leadership', score: 75, fullMark: 100 },
    ] as SkillRadarData[],
    growthPath: [
        { skill: 'Kubernetes', category: 'DevOps', currentProficiency: 75, targetLevel: 'Staff Engineer', recommendation: 'Level Up Soon' },
        { skill: 'GraphQL', category: 'API', currentProficiency: 45, targetLevel: 'Intermediate', recommendation: 'View Internal Docs' },
        { skill: 'Cybersecurity', category: 'Security', currentProficiency: 88, targetLevel: 'Advanced', recommendation: 'Exam Prep' }
    ] as GrowthPathItem[],
};

export const MOCK_ONBOARDING_TASKS: OnboardingTask[] = [
    { id: '1', title: 'Request SSH keys & VPN access', description: 'Completed 2 days ago', status: 'completed', type: 'required' },
    { id: '2', title: 'Local environment setup (Docker & Node v20)', description: 'Priority: High', status: 'pending', type: 'priority' },
    { id: '3', title: 'Initial commit to personal sandbox repo', description: 'Due by Friday', status: 'pending', type: 'goal' },
    { id: '4', title: 'Join #eng-general and introduce yourself', description: 'Social goal', status: 'pending', type: 'social' },
];