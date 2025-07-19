import Link from "next/link";

export default function ExtrasHome() {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded space-y-4">
      <h1 className="text-2xl mb-4">Extra Features</h1>
      <ul className="space-y-2">
        <li><Link href="/extras/settings" className="text-blue-600 underline">User Settings</Link></li>
        <li><Link href="/extras/tags" className="text-blue-600 underline">Global Tags</Link></li>
        <li><Link href="/extras/activity" className="text-blue-600 underline">Activity Logs</Link></li>
        <li><Link href="/extras/attachments" className="text-blue-600 underline">Attachments</Link></li>
        <li><Link href="/extras/shared" className="text-blue-600 underline">Shared Notes</Link></li>
        <li><Link href="/extras/profile" className="text-blue-600 underline">User Profile</Link></li>
        <li><Link href="/extras/reminders" className="text-blue-600 underline">Reminders</Link></li>
        <li><Link href="/extras/calendar" className="text-blue-600 underline">Calendar Events</Link></li>
      </ul>
    </div>
  );
} 