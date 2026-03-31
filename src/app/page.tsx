import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "DOCENTE") {
    redirect("/dashboard/docente");
  }

  if (["OPP", "AQV_OE"].includes(session.user.role)) {
    redirect("/dashboard/pedagogico");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        <p>Papel não reconhecido no sistema.</p>
      </div>
    </div>
  );
}
