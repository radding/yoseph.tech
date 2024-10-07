import { fetchAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import { PaginatedPosts } from "../pagination";
import { Metadata } from "next";

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

export async function generateMetadata(params: Params): Promise<Metadata> {
  return {
    title: `Page ${params.params.page} of All Posts | Yoseph.tech`,
    description: "Read all of my posts, sorted in order by date of publish",
    alternates: {
      canonical: {
        url: `https://www.yoseph.tech/posts`,
      },
    },
  };
}

export const revalidate = 600;
