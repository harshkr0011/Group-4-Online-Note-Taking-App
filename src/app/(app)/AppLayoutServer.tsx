import { getAllTags } from "../actions/notes";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppLayoutClient from "./layout";

export default async function AppLayoutServer({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get?.('user');
  if (!session) {
    redirect('/login');
  }
  const tags = await getAllTags();
  return <AppLayoutClient tags={tags}>{children}</AppLayoutClient>;
} 