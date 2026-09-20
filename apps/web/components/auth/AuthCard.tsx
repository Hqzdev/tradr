import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ children, footer }: AuthCardProps) {
  return (
    <section className="tradr-auth-card">
      <header className="tradr-auth-card-header">
        <Link href="/" aria-label="TRADR — вернуться на главную" className="tradr-auth-brand">
          <Image src="/logo.png" alt="" width={30} height={30} />
          <span>TRADR</span>
        </Link>
        <span>Учитесь. Решайте. Растите.</span>
      </header>
      {children}
      {footer && <footer className="tradr-auth-card-footer">{footer}</footer>}
    </section>
  );
}
