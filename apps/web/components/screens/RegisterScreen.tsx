"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ApiError } from "@/lib/api/client";
import { register } from "@/lib/api/auth";
import { authPath } from "@/lib/authRedirect";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen({ nextPath = "/market" }: { nextPath?: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (displayName.trim().length < 2) nextErrors.displayName = "Введите имя";
    if (!EMAIL_RE.test(email)) nextErrors.email = "Введите корректный e-mail";
    if (password.length < 8) nextErrors.password = "Минимум 8 символов";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Пароли не совпадают";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setRequestError("");
    try {
      await register(email.trim(), password, displayName.trim());
      router.replace(nextPath);
    } catch (error) {
      setRequestError(error instanceof ApiError && error.status === 409 ? "Этот e-mail уже зарегистрирован" : "Не удалось создать аккаунт. Проверьте, что backend запущен.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <p className="text-heading-sm font-[485] text-ink">Создать аккаунт</p>
      <p className="mt-1.5 text-body-sm text-steel">Создайте личный аккаунт TRADR.</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Имя"
          autoComplete="name"
          placeholder="Ярослав"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          error={errors.displayName}
        />
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
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={!errors.password ? "Минимум 8 символов" : undefined}
        />
        <PasswordInput
          label="Повторите пароль"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting} className="mt-1">
          {submitting ? "Создаём…" : "Создать аккаунт"}
        </Button>
        {requestError && <p className="text-center text-body-sm text-negative">{requestError}</p>}
      </form>

      <p className="mt-6 text-center text-body-sm text-steel">
        Уже есть аккаунт?{" "}
        <Link href={authPath("/login", nextPath)} className="font-[535] text-magenta-deep transition-colors duration-150 hover:text-magenta">
          Войти
        </Link>
      </p>
    </Card>
  );
}
