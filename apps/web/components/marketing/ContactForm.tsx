"use client";

import { useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import styles from "./pages.module.css";

interface FormState {
  readonly name: string;
  readonly email: string;
  readonly topic: string;
  readonly message: string;
}

const initialState: FormState = { name: "", email: "", topic: "Общий вопрос", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.contactSuccess} role="status">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.6} />
        <h2>Черновик обращения готов</h2>
        <p>Форма работает локально и не отправляет данные. Подключение канала поддержки можно добавить отдельно.</p>
        <button type="button" onClick={() => { setForm(initialState); setSubmitted(false); }}>Создать другое обращение</button>
      </div>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={submit}>
      <label><span>Имя</span><input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label>
      <label><span>Электронная почта</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label>
      <label><span>Тема</span><select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}><option>Общий вопрос</option><option>Работа платформы</option><option>Карьера</option><option>Предложение</option><option>Конфиденциальность</option></select></label>
      <label><span>Сообщение</span><textarea required minLength={20} rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Опишите контекст и ожидаемый результат" /></label>
      <label className={styles.contactConsent}><input required type="checkbox" /><span>Я понимаю, что сейчас это локальная демонстрационная форма и данные не отправляются.</span></label>
      <button className={styles.submitButton} type="submit">Подготовить обращение <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} /></button>
    </form>
  );
}
