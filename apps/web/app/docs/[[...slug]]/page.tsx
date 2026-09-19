import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocsShell from "@/components/docs/DocsShell";
import { docsPages, getDocPage } from "@/lib/docs/content";

interface DocsPageProps {
  params: { slug?: string[] };
}

export function generateStaticParams() {
  return [{ slug: [] }, ...docsPages.filter((page) => page.slug !== "overview").map((page) => ({ slug: [page.slug] }))];
}

export function generateMetadata({ params }: DocsPageProps): Metadata {
  const page = getDocPage(params.slug?.[0]);
  if (!page) return {};
  return {
    title: `${page.title} — документация TRADR`,
    description: page.description,
  };
}

export default function DocumentationPage({ params }: DocsPageProps) {
  if ((params.slug?.length ?? 0) > 1) notFound();
  const page = getDocPage(params.slug?.[0]);
  if (!page) notFound();
  return <DocsShell page={page} />;
}
