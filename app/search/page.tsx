import PagefindSearch from "./PagefindSearch";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Search</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Search only works in a production build (<code>npm run build</code>), since it uses a
        static index generated at build time.
      </p>
      <div className="mt-8">
        <PagefindSearch />
      </div>
    </div>
  );
}
