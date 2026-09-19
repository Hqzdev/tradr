import type { DocPage, DocSection } from "@/lib/docs/content";

interface DocArticleProps {
  page: DocPage;
}

function FileList({ section }: { section: DocSection }) {
  if (!section.entries) return null;

  return (
    <div className="docs-file-list">
      {section.entries.map((entry) => (
        <div className="docs-file-row" key={`${section.id}-${entry.path}`}>
          <div className="docs-file-name">
            <code>{entry.path}</code>
            {entry.tag ? <span className="docs-file-tag">{entry.tag}</span> : null}
            {entry.warning ? <span className="docs-file-warning">{entry.warning}</span> : null}
          </div>
          <p>{entry.description}</p>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="docs-bullet-list">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true" />
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

export default function DocArticle({ page }: DocArticleProps) {
  return (
    <article className="docs-article">
      <header className="docs-article-header">
        <div className="docs-eyebrow">{page.eyebrow}</div>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <div className="docs-page-meta">
          <span>{page.sections.length} раздела</span>
          <i aria-hidden="true" />
          <span>{page.readTime} чтения</span>
          <i aria-hidden="true" />
          <span>Проверено по коду</span>
        </div>
      </header>

      {page.sections.map((section, index) => (
        <section className="docs-section" id={section.id} key={section.id}>
          <div className="docs-section-number">{String(index + 1).padStart(2, "0")}</div>
          <div className="docs-section-body">
            <h2>{section.title}</h2>
            {section.description ? <p className="docs-section-lead">{section.description}</p> : null}
            {section.bullets ? <BulletList items={section.bullets} /> : null}
            <FileList section={section} />
            {section.code ? (
              <div className="docs-code-block">
                <div className="docs-code-header">
                  <span>Пример</span>
                  <span>UTF-8</span>
                </div>
                <pre><code>{section.code}</code></pre>
              </div>
            ) : null}
            {section.note ? (
              <aside className="docs-note">
                <span className="docs-note-icon" aria-hidden="true">i</span>
                <div>
                  <strong>Важно</strong>
                  <p>{section.note}</p>
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      ))}
    </article>
  );
}
