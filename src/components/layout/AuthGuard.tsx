"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isRegistered = localStorage.getItem("donor_registered");
    const publicPaths = ["/register"]; // Only registration is public

    if (!isRegistered && !publicPaths.includes(pathname)) {
      router.push("/register");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking && !["/register", "/"].includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
