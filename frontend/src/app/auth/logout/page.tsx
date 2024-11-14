import LogOut from "@ui/logout/LogOut";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/auth/login");
    return;
  }

  return <LogOut />;
}
