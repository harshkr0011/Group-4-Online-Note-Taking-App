"use client";
import { useState } from "react";
import { saveUserSettings, getUserSettings } from "@/app/actions/extra";

export default function SettingsPage() {
  const [theme, setTheme] = useState<string>("light");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  // Optionally, load current settings on mount
  // useEffect(() => {
  //   getUserSettings().then(settings => {
  //     if (settings) {
  //       setTheme(settings.theme || "light");
  //       setNotifications(settings.notifications ?? true);
  //     }
  //   });
  // }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveUserSettings({ theme, notifications });
    setMessage("Settings saved!");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-2xl mb-4">User Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Theme</label>
          <select value={theme} onChange={e => setTheme(e.target.value)} className="border p-2 rounded">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Notifications</label>
          <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} /> Enable notifications
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
} 