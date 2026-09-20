"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { IconCheck, IconLoading, IconShield } from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { login } from "@/lib/api/auth";
import { authPath } from "@/lib/authRedirect";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen({ nextPath = "/dashboard", hasExplicitNext = false }: { nextPath?: string; hasExplicitNext?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [requestError, setRequestError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: FormErrors = {};
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Введите корректный e-mail";
    if (password.length < 8) nextErrors.password = "Минимум 8 символов";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setRequestError("");
    try {
      await login(email.trim(), password);
      setComplete(true);
      window.setTimeout(() => router.replace(nextPath), 360);
    } catch (error) {
      setRequestError(error instanceof ApiError && error.status === 401
        ? "Неверный e-mail или пароль"
        : "Не удалось войти. Проверьте подключение и попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard footer={<p>Нет аккаунта? <Link href={authPath("/register", hasExplicitNext ? nextPath : null)}>Создать аккаунт</Link></p>}>
      <div className="tradr-auth-login-intro">
        <span>Вход в рабочую среду</span>
        <h1>С возвращением</h1>
        <p>Продолжите наблюдать за рынком и решениями учебных агентов.</p>
      </div>

      <form className="tradr-auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }}
          error={errors.email}
        />
        <AuthPasswordField
          label="Пароль"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }}
          error={errors.password}
        />

        {requestError && <p className="tradr-auth-request-error" role="alert">{requestError}</p>}

        <button type="submit" className="tradr-auth-primary" disabled={submitting || complete}>
          {complete ? <IconCheck /> : submitting ? <IconLoading className="is-spinning" /> : null}
          {complete ? "Готово" : submitting ? "Входим…" : "Войти"}
        </button>
      </form>

      <div className="tradr-auth-trust"><IconShield /><span>Данные защищены персональной учётной записью TRADR.</span></div>
    </AuthCard>
  );
}
