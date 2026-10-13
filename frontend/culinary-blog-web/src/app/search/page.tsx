import SearchExperience from "@/app/search/search-experience";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const { q } = await searchParams;

  return (
    <SearchExperience initialQuery={typeof q === "string" ? q : q?.[0] ?? ""} />
  );
}
