import SearchBox from "./SearchBox";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Search</h1>
      <div className="mt-8">
        <SearchBox />
      </div>
    </div>
  );
}
