import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <NewsletterForm />
        <p className="mt-8 text-xs text-black/50 dark:text-white/50">
          © {new Date().getFullYear()} Simply Human Blog.
        </p>
      </div>
    </footer>
  );
}
