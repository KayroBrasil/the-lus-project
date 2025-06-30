"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth-form";
import { toast } from "sonner";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          name: "Fulano de Tal",
          isAuthenticated: true,
        }),
      );

      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          name: data.name,
          isAuthenticated: true,
        }),
      );

      toast.success("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
      />
    </div>
  );
}
