import { Feather } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
            <Feather className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-headline">FeatherNote</span>
        </Link>
       </div>
      {children}
    </main>
  );
}
