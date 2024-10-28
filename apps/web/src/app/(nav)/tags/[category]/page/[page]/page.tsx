import { getCategory } from "@/data/category/getCategory";
import { PaginatedCategories } from "../../pagination";
import { Metadata } from "next";
import { fetchData } from "@/data/fetch";

export default async function Page(props: {
  params: { category: string; page: string };
}) {
  const pageNumber = parseInt(props.params.page);
  return (
    <PaginatedCategories
      pageNumber={pageNumber}
      slug={props.params.category}
      type={"tags"}
    />
  );
}

export async function generateMetadata(params: {
  params: { category: string };
}): Promise<Metadata> {
  const categories = await getCategory(params.params.category, "tags");
  if (!categories) {
    return {};
  }
  return {
    title: `${categories.name} | Yoseph.tech`,
    description: categories.description ?? `My thought on ${categories.name}`,
    alternates: {
      canonical: {
        url: `https://www.yoseph.tech/tags/${params.params.category}`,
      },
    },
  };
}

export async function generateStaticParams(): Promise<
  { category: string; page: string }[]
> {
  const data = await fetchData(`query {
      categories {
        nodes {
          slug
        }
      }
      tags {
        nodes {
          slug
        }
      }
    }`);
  const tagInfo = await Promise.all(
    data.data.tags.nodes.map(async (category: { slug: string }) => {
      const pages = await getCategory(category.slug, "tags");
      return {
        type: "tags",
        category: category.slug,
        pages: pages?.posts.length,
      };
    })
  );

  const tagPages: {
    category: string;
    type: "tags";
    page: string;
  }[] = tagInfo.flatMap((category) => {
    for (let i = 0; i < category.pages; i++) {
      return {
        ...category,
        page: (i + 1).toString(),
      };
    }
  });
  return [...tagPages];
}

export const revalidate = 43200;
