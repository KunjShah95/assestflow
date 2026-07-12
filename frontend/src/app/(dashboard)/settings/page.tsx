"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ToastProvider";
import { apiPatch, apiPost } from "@/lib/api-client";
import type { User } from "@/types/common";
import {
  User as UserIcon,
  Bell,
  Palette,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

type TabId = "profile" | "notifications" | "appearance" | "security";

interface NotificationPrefs {
  emailAlerts: boolean;
  maintenanceUpdates: boolean;
  bookingConfirmations: boolean;
  auditReminders: boolean;
  transferRequests: boolean;
  systemAnnouncements: boolean;
}

interface AppearancePrefs {
  theme: "light" | "dark" | "system";
  compactMode: boolean;
}

const tabs: { id: TabId; label: string; icon: typeof UserIcon }[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

function loadPrefs<T>(key: string, defaults: T): T {
  if (typeof window === "undefined") return defaults;
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

const defaultNotifPrefs: NotificationPrefs = {
  emailAlerts: true,
  maintenanceUpdates: true,
  bookingConfirmations: true,
  auditReminders: false,
  transferRequests: true,
  systemAnnouncements: true,
};

const defaultAppearancePrefs: AppearancePrefs = {
  theme: "light",
  compactMode: false,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(defaultNotifPrefs);

  // Appearance state
  const [appearancePrefs, setAppearancePrefs] = useState<AppearancePrefs>(defaultAppearancePrefs);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const notif = loadPrefs("assetflow_notif_prefs", defaultNotifPrefs);
    const app = loadPrefs("assetflow_appearance_prefs", defaultAppearancePrefs);
    const t = setTimeout(() => {
      setNotifPrefs(notif);
      setAppearancePrefs(app);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (user) {
      const t = setTimeout(() => {
        setProfileName(user.name);
        setProfileEmail(user.email);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [user]);

  // Profile handlers
  const handleProfileSave = async () => {
    if (!profileName.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    setProfileSaving(true);
    try {
      await apiPatch<User>("/auth/profile", {
        name: profileName.trim(),
        email: profileEmail.trim(),
      });
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // Notification handlers
  const toggleNotif = (key: keyof NotificationPrefs) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    localStorage.setItem("assetflow_notif_prefs", JSON.stringify(updated));
    showToast("Notification preference saved", "success");
  };

  // Appearance handlers
  const setTheme = (theme: AppearancePrefs["theme"]) => {
    const updated = { ...appearancePrefs, theme };
    setAppearancePrefs(updated);
    localStorage.setItem("assetflow_appearance_prefs", JSON.stringify(updated));
    showToast(`Theme set to ${theme}`, "success");
  };

  const toggleCompact = () => {
    const updated = { ...appearancePrefs, compactMode: !appearancePrefs.compactMode };
    setAppearancePrefs(updated);
    localStorage.setItem("assetflow_appearance_prefs", JSON.stringify(updated));
    showToast(updated.compactMode ? "Compact mode enabled" : "Compact mode disabled", "success");
  };

  // Security handlers
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Enter your current password", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setPasswordSaving(true);
    try {
      await apiPost<{ message: string }>("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      showToast("Password changed successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to change password", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  const notifItems: { key: keyof NotificationPrefs; label: string; desc: string }[] = [
    { key: "emailAlerts", label: "Email Alerts", desc: "Receive important notifications via email" },
    { key: "maintenanceUpdates", label: "Maintenance Updates", desc: "Get notified about maintenance schedule changes" },
    { key: "bookingConfirmations", label: "Booking Confirmations", desc: "Confirmation emails for resource bookings" },
    { key: "auditReminders", label: "Audit Reminders", desc: "Reminders for upcoming and pending audits" },
    { key: "transferRequests", label: "Transfer Requests", desc: "Alerts for asset transfer approvals" },
    { key: "systemAnnouncements", label: "System Announcements", desc: "Platform updates and announcements" },
  ];

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    asset_manager: "Asset Manager",
    department_head: "Department Head",
    employee: "Employee",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[#0F172A] text-[24px] font-bold tracking-tight">Settings</h1>
        <p className="text-[#475569] text-[14px] mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-[220px] shrink-0">
          <nav className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors text-left ${
                    isActive
                      ? "bg-[#F1F5F9] text-[#0F172A] border-l-[3px] border-[#2563EB]"
                      : "text-[#475569] hover:bg-[#F8FAFC] border-l-[3px] border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-6 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h2 className="text-[18px] font-semibold text-[#0F172A]">Profile Information</h2>
                <p className="text-[13px] text-[#475569] mt-1">Update your personal details.</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[22px] font-bold shadow-sm">
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-[#0F172A]">{user?.name}</p>
                  <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full">
                    {roleLabels[user?.role || "employee"] || user?.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="settings-name" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[14px] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[14px] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Read-only info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#475569] mb-1.5">
                    Role
                  </label>
                  <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[14px] text-[#475569] cursor-not-allowed">
                    {roleLabels[user?.role || "employee"] || user?.role}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#475569] mb-1.5">
                    User ID
                  </label>
                  <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[14px] text-[#475569] font-mono cursor-not-allowed">
                    #{user?.id}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                >
                  <Save size={16} />
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-1 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-4 mb-4">
                <h2 className="text-[18px] font-semibold text-[#0F172A]">Notification Preferences</h2>
                <p className="text-[13px] text-[#475569] mt-1">Choose which notifications you want to receive.</p>
              </div>

              {notifItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[#0F172A]">{item.label}</p>
                    <p className="text-[12px] text-[#475569] mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      notifPrefs[item.key] ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                    }`}
                    role="switch"
                    aria-checked={notifPrefs[item.key]}
                  >
                    <span
                      className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        notifPrefs[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-6 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h2 className="text-[18px] font-semibold text-[#0F172A]">Appearance</h2>
                <p className="text-[13px] text-[#475569] mt-1">Customize how AssetFlow looks for you.</p>
              </div>

              {/* Theme Selector */}
              <div>
                <p className="text-[14px] font-medium text-[#0F172A] mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "light" as const, label: "Light", icon: Sun },
                    { id: "dark" as const, label: "Dark", icon: Moon },
                    { id: "system" as const, label: "System", icon: Monitor },
                  ]).map((t) => {
                    const Icon = t.icon;
                    const selected = appearancePrefs.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          selected
                            ? "border-[#2563EB] bg-[#EFF6FF]"
                            : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                        <Icon size={24} className={selected ? "text-[#2563EB]" : "text-[#475569]"} />
                        <span className={`text-[13px] font-medium ${selected ? "text-[#2563EB]" : "text-[#475569]"}`}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between py-4 border-t border-[#F1F5F9]">
                <div>
                  <p className="text-[14px] font-medium text-[#0F172A]">Compact Mode</p>
                  <p className="text-[12px] text-[#475569] mt-0.5">Reduce spacing and padding for denser layouts</p>
                </div>
                <button
                  onClick={toggleCompact}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    appearancePrefs.compactMode ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                  }`}
                  role="switch"
                  aria-checked={appearancePrefs.compactMode}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      appearancePrefs.compactMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-6 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h2 className="text-[18px] font-semibold text-[#0F172A]">Security</h2>
                <p className="text-[13px] text-[#475569] mt-1">Manage your password and account security.</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                <div>
                  <label htmlFor="current-pw" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-pw"
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 pr-10 text-[14px] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-pw" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-pw"
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 pr-10 text-[14px] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && newPassword.length < 6 && (
                    <p className="text-[11px] text-[#EF4444] mt-1">Password must be at least 6 characters</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-pw" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-pw"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[14px] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  />
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-[#EF4444] mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Shield size={16} />
                    {passwordSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>

              {/* Session info */}
              <div className="border-t border-[#E2E8F0] pt-5 mt-6">
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Session Information</h3>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#475569]">Logged in as</span>
                    <span className="text-[#0F172A] font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#475569]">Role</span>
                    <span className="text-[#0F172A] font-medium">
                      {roleLabels[user?.role || "employee"] || user?.role}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#475569]">Account Status</span>
                    <span className="text-[#16A34A] font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
