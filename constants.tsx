
import { Workspace, AITask, SecurityAlert, Repository, LiveSession, ProfileData } from './types';

export const MOCK_REPOS: Repository[] = [
  {
    id: 'trackcodex-backend',
    name: 'trackcodex-backend',
    description: 'Core API service for the TrackCodex platform handling user authentication, repository indexing, and AI analysis queuing.',
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
    description: 'React-based frontend for the main dashboard including all charting components, collaborative tools, and AI insights.',
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
    description: 'Public facing documentation built with Docusaurus. Contains guides, API reference, and platform architecture docs.',
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
    id: '1',
    name: 'track-api-prod',
    status: 'Running',
    runtime: 'Node 20.x',
    lastModified: '2m ago',
    repo: 'trackcodex/core-engine',
    branch: 'main',
    commit: 'f29a1d4',
    collaborators: ['https://picsum.photos/seed/1/32', 'https://picsum.photos/seed/2/32']
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
