import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Settings } from "lucide-react";
import Link from "next/link";
import { NavIndicator } from "./NavIndicator";
import { UserNav } from "./UserNav";

export default async function Header() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-inner border border-red-700/20">
              <span className="text-white font-bold text-lg leading-none select-none">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 hidden sm:block leading-tight">SENAI MARIANO FERRAZ</h1>
              <p className="text-[10px] text-muted-foreground font-medium hidden sm:block leading-none mt-0.5 uppercase tracking-wider">Edulink</p>
            </div>
          </Link>
          <NavIndicator />
        </div>
        <div className="flex items-center gap-4">
          <UserNav user={session.user} />
        </div>
      </div>
    </header>
  );
}
