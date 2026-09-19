"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ApiError } from "@/lib/api/client";
import { login } from "@/lib/api/auth";
import { authPath } from "@/lib/authRedirect";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen({ nextPath = "/market" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!EMAIL_RE.test(email)) nextErrors.email = "Введите корректный e-mail";
    if (password.length < 8) nextErrors.password = "Минимум 8 символов";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setRequestError("");
    try {
      await login(email.trim(), password);
      router.replace(nextPath);
    } catch (error) {
      setRequestError(error instanceof ApiError && error.status === 401 ? "Неверный e-mail или пароль" : "Не удалось войти. Проверьте, что backend запущен.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <p className="text-heading-sm font-[485] text-ink">Вход</p>
      <p className="mt-1.5 text-body-sm text-steel">Войдите в свой аккаунт TRADR.</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="Пароль"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting} className="mt-1">
          {submitting ? "Входим…" : "Войти"}
        </Button>
        {requestError && <p className="text-center text-body-sm text-negative">{requestError}</p>}
      </form>

      <p className="mt-6 text-center text-body-sm text-steel">
        Нет аккаунта?{" "}
        <Link href={authPath("/register", nextPath)} className="font-[535] text-magenta-deep transition-colors duration-150 hover:text-magenta">
          Зарегистрироваться
        </Link>
      </p>
    </Card>
  );
}
