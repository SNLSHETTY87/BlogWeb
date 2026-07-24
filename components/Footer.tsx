import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <NewsletterForm />
        <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 text-xs text-black/45 dark:border-white/10 dark:text-white/45">
          <p>© {new Date().getFullYear()} Simply Human</p>
          <p>Human psychology, explained — with science.</p>
        </div>
      </div>
    </footer>
  );
}
