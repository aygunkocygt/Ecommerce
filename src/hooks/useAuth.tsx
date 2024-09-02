import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useAuth(redirectUrl = "/login") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push(redirectUrl); // Redirect if not authenticated
  }, [session, status]);

  return session;
}
