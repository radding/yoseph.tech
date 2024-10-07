import { Metadata } from "next";
import { PaginatedPosts } from "./page/pagination";

export default function Page() {
  return <PaginatedPosts pageNumber={1} />;
}

export async function generateMetadata(params: {
  params: { category: string };
}): Promise<Metadata> {
  return {
    title: `All Posts | Yoseph.tech`,
    description: "Read all of my posts, sorted in order by date of publish",
    alternates: {
      canonical: {
        url: `https://www.yoseph.tech/posts/`,
      },
    },
  };
}

export const revalidate = 600;
