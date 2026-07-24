import SearchBox from "./SearchBox";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Search</h1>
      <div className="mt-8">
        <SearchBox />
      </div>
    </div>
  );
}
