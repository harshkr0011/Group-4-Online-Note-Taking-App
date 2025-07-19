"use client";
import { useState, useEffect } from "react";
import { addGlobalTag, getGlobalTags } from "@/app/actions/extra";

export default function TagsPage() {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getGlobalTags().then(t => setTags(t.map(tagObj => tagObj.name)));
  }, []);

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!tag) return;
    await addGlobalTag(tag);
    setMessage("Tag added!");
    setTag("");
    const updated = await getGlobalTags();
    setTags(updated.map(tagObj => tagObj.name));
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-2xl mb-4">Global Tags</h1>
      <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Add tag" className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <ul className="list-disc pl-5">
        {tags.map(t => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
} 