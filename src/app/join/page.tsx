import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { JoinWizard } from "@/components/JoinWizard";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const user = await currentUser();
  if (user) redirect("/matches");
  return <JoinWizard />;
}
