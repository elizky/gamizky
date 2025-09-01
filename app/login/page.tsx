"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya está autenticado
    getSession().then((session) => {
      if (session) {
        router.push("/home");
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Error signing in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo Hero */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-yellow-400 border-4 border-black mx-auto flex items-center justify-center relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-6xl">🎮</span>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 border-2 border-black flex items-center justify-center">
              <span className="text-white font-black text-sm">1</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-display font-black text-gray-800 mb-2">GAMIZKY</h1>
        <p className="text-gray-600 mb-8 font-sans">Convierte tareas en XP</p>

        {/* Login Button */}
        <Button
          variant="neo-primary"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="px-8 py-4 text-lg font-display font-black flex items-center gap-3 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              CONECTANDO...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              ENTRAR CON GOOGLE
            </>
          )}
        </Button>

        <p className="text-sm text-gray-500 mt-4 font-sans">
          Solo necesitas una cuenta de Google
        </p>
      </div>
    </div>
  );
}
