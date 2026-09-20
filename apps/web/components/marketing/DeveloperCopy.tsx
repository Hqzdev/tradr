"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import styles from "./pages.module.css";

const command = "npm install @tradr/sdk";

async function writeToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  }
}

export default function DeveloperCopy() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    if (await writeToClipboard(command)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className={styles.commandCard}>
      <div><span>Быстрый старт</span><small>SDK</small></div>
      <code>{command}</code>
      <button onClick={copyCommand} type="button" aria-label="Копировать команду">
        <HugeiconsIcon icon={copied ? CheckmarkCircle02Icon : Copy01Icon} strokeWidth={1.8} />
        <span>{copied ? "Скопировано" : "Копировать"}</span>
      </button>
    </div>
  );
}
