import React, { useState, useEffect, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Auth Views
const Login = React.lazy(() => import("./views/auth/Login"));
const Signup = React.lazy(() => import("./views/auth/Signup"));
const OAuthCallback = React.lazy(() => import("./views/auth/OAuthCallback"));

// Layout Components
import StatusBar from "./components/layout/StatusBar";
import Sidebar from "./components/layout/Sidebar";
import MessagingPanel from "./components/messaging/MessagingPanel";
import SplashScreen from "./components/branding/SplashScreen";
import SettingsLayout from "./components/settings/SettingsLayout";
import CommandPalette from "./components/layout/CommandPalette";
import ChatWidget from "./components/social/ChatWidget"; // Global Chat

// Core Views
const RepositoriesView = React.lazy(() => import("./views/Repositories"));
const RepoDetailView = React.lazy(() => import("./views/RepoDetail"));
const EditorView = React.lazy(() => import("./views/Editor"));
const ProfileView = React.lazy(() => import("./views/Profile"));
const Overview = React.lazy(() => import("./views/Overview"));
const WorkspacesView = React.lazy(() => import("./views/Workspaces"));
const CreateWorkspaceView = React.lazy(() => import("./views/CreateWorkspace"));
// const WorkspaceDetailView = React.lazy(
//   () => import("./views/WorkspaceDetailView"),
// );
import WorkspaceEmbed from "./components/ide/WorkspaceEmbed"; // Synchronous import for speed or consistent load,
const HomeView = React.lazy(() => import("./views/Home"));
const LibraryView = React.lazy(() => import("./views/Library"));
const ForgeAIView = React.lazy(() => import("./views/ForgeAI"));
const NotificationsView = React.lazy(() => import("./views/NotificationsView"));

const AdminRoomView = React.lazy(() => import("./views/Admin"));
const PlatformMatrix = React.lazy(() => import("./views/PlatformMatrix"));
const ActivityView = React.lazy(() => import("./views/ActivityView"));
import RoleGuard from "./auth/RoleGuard";
const CommunityView = React.lazy(() => import("./views/Community"));

// Organization Views
const OrganizationIndexView = React.lazy(
  () => import("./views/organizations/OrganizationIndexView"),
);
const OrganizationDetailView = React.lazy(
  () => import("./views/organizations/OrganizationDetailView"),
);
const OrgOverview = React.lazy(
  () => import("./components/organizations/OrgOverview"),
);
const OrgRepositories = React.lazy(
  () => import("./components/organizations/OrgRepositories"),
);
const OrgPeople = React.lazy(
  () => import("./components/organizations/OrgPeople"),
);
const OrgTeams = React.lazy(
  () => import("./components/organizations/OrgTeams"),
);
const OrgSettingsLayout = React.lazy(
  () => import("./components/organizations/OrgSettingsLayout"),
);
const OrgGeneralSettings = React.lazy(
  () => import("./views/organizations/settings/OrgGeneralSettings"),
);
const OrgAuthenticationSecurity = React.lazy(
  () => import("./views/organizations/settings/OrgAuthenticationSecurity"),
);
const OrgEnvironments = React.lazy(
  () => import("./views/organizations/settings/OrgEnvironments"),
);
const OrgPermissions = React.lazy(
  () => import("./views/organizations/settings/OrgPermissions"),
);
const OrgWebhooks = React.lazy(
  () => import("./views/organizations/settings/OrgWebhooks"),
);

// Settings Sub-views
const AppearanceSettings = React.lazy(
  () => import("./views/settings/AppearanceSettings"),
);
const EmailSettings = React.lazy(
  () => import("./views/settings/EmailSettings"),
);
const SecuritySettings = React.lazy(
  () => import("./views/settings/SecuritySettings"),
);
const AccountSettings = React.lazy(
  () => import("./views/settings/AccountSettings"),
);
const ProfileSettings = React.lazy(
  () => import("./views/settings/ProfileSettings"),
);
const BillingSettings = React.lazy(
  () => import("./views/settings/BillingSettings"),
);
const ForgeAIUsageSettings = React.lazy(
  () => import("./views/settings/ForgeAIUsageSettings"),
);
const AccessibilitySettings = React.lazy(
  () => import("./views/settings/AccessibilitySettings"),
);
const NotificationsSettings = React.lazy(
  () => import("./views/settings/NotificationsSettings"),
);
const PersonalAccessTokensSettings = React.lazy(
  () => import("./views/settings/PersonalAccessTokensSettings"),
);
const IntegrationsSettings = React.lazy(
  () => import("./views/settings/IntegrationsSettings"),
);

// --- NEW HIRING & GROWTH VIEWS ---
const MarketplaceLayout = React.lazy(
  () => import("./views/marketplace/MarketplaceLayout"),
);
const OnboardingLayout = React.lazy(
  () => import("./views/onboarding/OnboardingLayout"),
);
const WelcomeView = React.lazy(() => import("./views/onboarding/WelcomeView"));
const OfferAcceptanceView = React.lazy(
  () => import("./views/trials/OfferAcceptanceView"),
);

const TrialSubmittedView = React.lazy(
  () => import("./views/trials/TrialSubmittedView"),
);

// --- Marketplace Sub-views ---
const MissionsView = React.lazy(
  () => import("./views/marketplace/MissionsView"),
);
const MissionDetailView = React.lazy(
  () => import("./views/marketplace/MissionDetailView"),
);
const MyApplicationsView = React.lazy(
  () => import("./views/marketplace/MyApplicationsView"),
);
const TrialRepositoriesView = React.lazy(
  () => import("./views/marketplace/TrialRepositoriesView"),
);

// --- Hiring Sub-views ---
const HiringLayout = React.lazy(() => import("./views/hiring/HiringLayout"));
const CandidateDiscoveryView = React.lazy(
  () => import("./views/hiring/CandidateDiscoveryView"),
);
const CandidateScorecardView = React.lazy(
  () => import("./views/hiring/CandidateScorecardView"),
);
const CandidateComparisonView = React.lazy(
  () => import("./views/hiring/CandidateComparisonView"),
);
const OfferEditorView = React.lazy(
  () => import("./views/hiring/OfferEditorView"),
);
const SessionSchedulerView = React.lazy(
  () => import("./views/hiring/SessionSchedulerView"),
);
const InterviewerFeedbackView = React.lazy(
  () => import("./views/hiring/InterviewerFeedbackView"),
);
const AssessmentsView = React.lazy(
  () => import("./views/hiring/AssessmentsView"),
);
const JobApplicationsView = React.lazy(
  () => import("./views/hiring/JobApplicationsView"),
);

// --- Growth Sub-views ---
const GrowthLayout = React.lazy(() => import("./views/growth/GrowthLayout"));
const SkillDashboardView = React.lazy(
  () => import("./views/growth/SkillDashboardView"),
);
const DeveloperProfileView = React.lazy(
  () => import("./views/growth/DeveloperProfileView"),
);

// --- Onboarding Sub-views ---
const OnboardingWorkspace = React.lazy(
  () => import("./views/onboarding/OnboardingWorkspace"),
);
const BuddyDashboardView = React.lazy(
  () => import("./views/onboarding/BuddyDashboardView"),
);
const WalletDashboard = React.lazy(
  () => import("./views/finance/WalletDashboard"),
);

// --- Admin Sub-views ---
const AdminOverview = React.lazy(
  () => import("./components/admin/AdminOverview"),
);
const UserManager = React.lazy(() => import("./components/admin/UserManager"));
const TeamManager = React.lazy(() => import("./components/admin/TeamManager"));
const WorkspaceMonitor = React.lazy(
  () => import("./components/admin/WorkspaceMonitor"),
);
const RepositoryGovernance = React.lazy(
  () => import("./components/admin/RepositoryGovernance"),
);
const JobOversight = React.lazy(
  () => import("./components/admin/JobOversight"),
);
const CommunityModeration = React.lazy(
  () => import("./components/admin/CommunityModeration"),
);
const RoleEditor = React.lazy(() => import("./components/admin/RoleEditor"));
const AuditLogs = React.lazy(() => import("./components/admin/AuditLogs"));
const AdminDashboard = React.lazy(() => import("./views/AdminDashboard"));

import { logActivity } from "./services/activityLogger";

const ProtectedApp = () => {
  const [notification, setNotification] = useState<any>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const handleNotify = (e: any) => {
      setNotification(e.detail);
      if (!e.detail.hasActions) {
        setTimeout(() => setNotification(null), 5000);
      }
    };
    window.addEventListener("trackcodex-notification", handleNotify);
    return () =>
      window.removeEventListener("trackcodex-notification", handleNotify);
  }, []);

  const handleAction = (action: "accept" | "reject") => {
    setNotification(null);
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const isIdeView = ["/editor", "/workspace/", "/trials/live-session"].some(
    (path) => location.pathname.includes(path),
  );

  // Global Key Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Prevent browser save
        console.log("Global Save Triggered");
        logActivity("save", { context: location.pathname });
        // In a real app, we'd also trigger the active editor's save method via context
        setNotification({
          type: "success",
          title: "Saved",
          message: "Workspace changes saved.",
          hasActions: false,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAddMenuOpen && !target.closest(".add-menu-container"))
        setIsAddMenuOpen(false);
      if (isNotificationsOpen && !target.closest(".notifications-container"))
        setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddMenuOpen, isNotificationsOpen]);

  // --- REAL NOTIFICATIONS LOGIC ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth(); // Assuming AuthContext provides user

  // Fetch Initial Notifications
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:4000/api/v1/notifications?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, [user]);

  // Listen for Real-Time Notification Events (via custom event from ChatWidget/WebSocket)
  useEffect(() => {
    const handleRealTimeNotif = (e: any) => {
      const newNotif = e.detail;
      setNotifications((prev) => [newNotif, ...prev]);
      // Also show toast
      setNotification({
        type: "info",
        title: newNotif.title,
        message: newNotif.message,
        hasActions: false,
      });
    };
    window.addEventListener(
      "trackcodex-realtime-notification",
      handleRealTimeNotif,
    );
    return () =>
      window.removeEventListener(
        "trackcodex-realtime-notification",
        handleRealTimeNotif,
      );
  }, []);

  // Use the fetched notifications instead of Mock
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            id: "mock1",
            type: "system",
            title: "Welcome",
            message: "No new notifications yet.",
            time: "Now",
            read: true,
          },
        ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden text-slate-300 font-display bg-[#0d0d0f] transition-colors duration-300">
      {notification && (
        <div className="fixed top-12 right-12 z-[500] bg-[#161b22] border border-primary/30 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col gap-6 max-w-sm ring-2 ring-black/50 ring-inset">
          <div className="flex items-start gap-4">
            {/* ... existing toast UI ... */}
            <div className="min-w-0">
              <h4 className="text-[15px] font-black text-white uppercase tracking-tight truncate">
                {notification.title}
              </h4>
              <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gh-text-secondary hover:text-white shrink-0 mt-1"
            >
              <span className="material-symbols-outlined !text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex min-h-0">
        {!isFocusMode && <Sidebar />}

        <main
          ref={mainScrollRef}
          className={`flex-1 min-w-0 flex flex-col bg-gh-bg relative ${isIdeView || isFocusMode ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"}`}
        >
          {/* Global Search Header - Visible on all non-IDE pages if desired, or just home. User wants 'Global'. */}
          {!isIdeView && !isFocusMode && (
            <div className="h-14 border-b border-white/5 grid grid-cols-[1fr_auto_1fr] items-center px-6 bg-[#0d1117] shrink-0 sticky top-0 z-40">
              <div className="flex items-center">
                {/* Left Spacer / Breadcrumbs placeholder */}
              </div>

              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md w-[400px] cursor-pointer hover:border-slate-500 transition-colors group shadow-sm"
              >
                <span className="material-symbols-outlined !text-[16px] text-slate-500 group-hover:text-slate-300">
                  search
                </span>
                <span className="text-sm text-slate-500 group-hover:text-slate-300 flex-1">
                  Type{" "}
                  <kbd className="border border-[#30363d] rounded px-1 text-[10px] bg-[#0d1117]">
                    /
                  </kbd>{" "}
                  to search
                </span>
              </div>

              <div className="flex items-center justify-end gap-4">
                {/* Notifications Dropdown */}
                <div className="relative notifications-container">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`text-slate-400 hover:text-white transition-colors relative ${isNotificationsOpen ? "text-white" : ""}`}
                    title="Notifications"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      notifications
                    </span>
                    <span className="absolute top-0 right-0 size-2 bg-blue-500 rounded-full border-2 border-[#0d1117]"></span>
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]/50 bg-[#0d1117]">
                        <span className="text-xs font-black uppercase tracking-widest text-white">
                          Notifications
                        </span>
                        <button className="text-[10px] text-primary hover:underline">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {displayNotifications.map((notif: any) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-[#30363d]/30 hover:bg-[#1f242c] transition-colors cursor-pointer group ${!notif.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  notif.type === "job"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : notif.type === "comment"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : notif.type === "community"
                                        ? "bg-purple-500/10 text-purple-500"
                                        : "bg-slate-500/10 text-slate-400"
                                }`}
                              >
                                <span className="material-symbols-outlined !text-[16px]">
                                  {notif.type === "job"
                                    ? "work"
                                    : notif.type === "comment"
                                      ? "chat_bubble"
                                      : notif.type === "community"
                                        ? "local_fire_department"
                                        : "info"}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <h5
                                    className={`text-sm font-bold ${!notif.read ? "text-white" : "text-slate-400"}`}
                                  >
                                    {notif.title}
                                  </h5>
                                  <span className="text-[10px] text-slate-500">
                                    {notif.createdAt
                                      ? new Date(
                                          notif.createdAt,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Now"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 group-hover:text-slate-300">
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate("/settings/notifications")}
                        className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-white bg-[#0d1117] border-t border-[#30363d]/50 transition-colors uppercase tracking-widest"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Menu Dropdown */}
                <div className="relative add-menu-container">
                  <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className={`text-slate-400 hover:text-white transition-colors ${isAddMenuOpen ? "text-white" : ""}`}
                    title="Create New..."
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      add
                    </span>
                  </button>

                  {isAddMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 border-b border-[#30363d]/50 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Create New
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/workspace/new");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1f242c] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          laptop_mac
                        </span>
                        Workspace
                      </button>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/repositories");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1f242c] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          folder_open
                        </span>
                        Repository
                      </button>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/marketplace/missions");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1f242c] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          rocket_launch
                        </span>
                        Mission
                      </button>
                      <div className="h-px bg-[#30363d]/50 my-1"></div>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/organizations");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1f242c] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          domain
                        </span>
                        Organization
                      </button>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => navigate("/settings/profile")}
                  className="cursor-pointer"
                  title="Profile Settings"
                >
                  <img
                    src="https://picsum.photos/seed/alexprofile/64"
                    className="size-6 rounded-full border border-white/10 hover:border-white/50 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <React.Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center bg-gh-bg min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
                    Synchronizing Interface...
                  </p>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/home" />} />
              <Route path="/dashboard/home" element={<HomeView />} />
              <Route path="/platform-matrix" element={<PlatformMatrix />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/workspaces" element={<WorkspacesView />} />
              <Route path="/community" element={<CommunityView />} />
              <Route path="/workspace/new" element={<CreateWorkspaceView />} />
              <Route path="/workspace/:id" element={<WorkspaceEmbed />} />
              <Route path="/repositories" element={<RepositoriesView />} />
              <Route path="/repo/:id" element={<RepoDetailView />} />
              <Route path="/dashboard/library" element={<LibraryView />} />
              <Route
                path="/editor"
                element={<EditorView isFocusMode={isFocusMode} />}
              />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/activity" element={<ActivityView />} />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route path="/org-dashboard" element={<AdminDashboard />} />

              <Route
                path="/organizations"
                element={<OrganizationIndexView />}
              />
              <Route path="/org/:orgId" element={<OrganizationDetailView />}>
                <Route index element={<OrgOverview />} />
                <Route path="repositories" element={<OrgRepositories />} />
                <Route path="people" element={<OrgPeople />} />
                <Route path="teams" element={<OrgTeams />} />
                <Route path="settings" element={<OrgSettingsLayout />}>
                  <Route index element={<Navigate to="general" replace />} />
                  <Route path="general" element={<OrgGeneralSettings />} />
                  <Route
                    path="authentication"
                    element={<OrgAuthenticationSecurity />}
                  />
                  <Route path="environments" element={<OrgEnvironments />} />
                  <Route path="permissions" element={<OrgPermissions />} />
                  <Route path="webhooks" element={<OrgWebhooks />} />
                  <Route path="*" element={<Navigate to="general" replace />} />
                </Route>
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              <Route path="/marketplace" element={<MarketplaceLayout />}>
                <Route index element={<Navigate to="missions" replace />} />
                <Route path="missions" element={<MissionsView />} />
                <Route path="missions/:id" element={<MissionDetailView />} />
                <Route path="applications" element={<MyApplicationsView />} />
                <Route path="trials" element={<TrialRepositoriesView />} />

                <Route path="hiring" element={<HiringLayout />}>
                  <Route index element={<Navigate to="discovery" replace />} />
                  <Route
                    path="discovery"
                    element={<CandidateDiscoveryView />}
                  />
                  <Route
                    path="candidate/:id"
                    element={<CandidateScorecardView />}
                  />
                  <Route path="compare" element={<CandidateComparisonView />} />
                  <Route path="offer/:id" element={<OfferEditorView />} />
                  <Route
                    path="schedule/:id"
                    element={<SessionSchedulerView />}
                  />
                  <Route
                    path="feedback/:id"
                    element={<InterviewerFeedbackView />}
                  />
                  <Route path="assessments" element={<AssessmentsView />} />
                  <Route
                    path="*"
                    element={<Navigate to="discovery" replace />}
                  />
                </Route>

                <Route path="growth" element={<GrowthLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SkillDashboardView />} />
                  <Route
                    path="profile/:id"
                    element={<DeveloperProfileView />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="dashboard" replace />}
                  />
                </Route>

                <Route path="*" element={<Navigate to="missions" replace />} />
              </Route>
              <Route
                path="/dashboard/jobs"
                element={<Navigate to="/marketplace/missions" replace />}
              />
              <Route
                path="/jobs/:id"
                element={<Navigate to="/marketplace/missions/:id" replace />}
              />
              <Route
                path="/jobs/:id/applications"
                element={<JobApplicationsView />}
              />

              <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OnboardingWorkspace />} />
                <Route path="buddy" element={<BuddyDashboardView />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route path="/finance" element={<WalletDashboard />} />

              <Route path="/welcome/:userId" element={<WelcomeView />} />
              <Route
                path="/offer/:offerId/accept"
                element={<OfferAcceptanceView />}
              />

              <Route
                path="/trials/submitted/:trialId"
                element={<TrialSubmittedView />}
              />

              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route
                  path="accessibility"
                  element={<AccessibilitySettings />}
                />
                <Route
                  path="notifications"
                  element={<NotificationsSettings />}
                />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="emails" element={<EmailSettings />} />
                <Route path="billing" element={<BillingSettings />} />
                <Route
                  path="forge-ai-usage"
                  element={<ForgeAIUsageSettings />}
                />
                <Route
                  path="tokens"
                  element={<PersonalAccessTokensSettings />}
                />
                <Route path="integrations" element={<IntegrationsSettings />} />
                <Route path="*" element={<Navigate to="profile" replace />} />
              </Route>

              <Route path="/forge-ai" element={<ForgeAIView />} />

              <Route
                path="/admin"
                element={
                  <RoleGuard>
                    <AdminRoomView />
                  </RoleGuard>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<UserManager />} />
                <Route path="teams" element={<TeamManager />} />
                <Route path="workspaces" element={<WorkspaceMonitor />} />
                <Route path="repositories" element={<RepositoryGovernance />} />
                <Route path="jobs" element={<JobOversight />} />
                <Route path="community" element={<CommunityModeration />} />
                <Route path="roles" element={<RoleEditor />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard/home" />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
      {!isFocusMode && <StatusBar />}
      {!isFocusMode && <MessagingPanel />}
      <ChatWidget /> {/* Global Real-Time Chat */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/*" element={<ProtectedApp />} />
      )}
    </Routes>
  );
};

// This new component ensures that AuthProvider and AppContent are rendered *inside* the router's context,
// preventing the `useNavigate` hook in AuthProvider from being called before the context is available.
const AppWithProviders = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

const App = () => (
  <ThemeProvider>
    <HashRouter>
      <AppWithProviders />
    </HashRouter>
  </ThemeProvider>
);

export default App;
