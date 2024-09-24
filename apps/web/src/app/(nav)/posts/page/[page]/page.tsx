import { fetchAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import { PaginatedPosts } from "../pagination";

type Params = {
  params: {
    page: string;
  };
};

export default async function Page(params: Params) {
  return <PaginatedPosts pageNumber={parseInt(params.params.page, 10)} />;
}

export async function generateStaticParams() {
  const pages = await fetchAllPosts();
  const allPages: { page: string }[] = [];
  for (let i = 1; i <= pages.length; i++) {
    allPages.push({ page: "" + i });
  }
  return allPages;
}
