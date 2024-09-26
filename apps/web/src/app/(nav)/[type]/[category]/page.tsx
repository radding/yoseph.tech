import { getCategory } from "@/data/category/getCategory";
import { notFound } from "next/navigation";
import { PaginatedCategories } from "./pagination";
import { Metadata } from "next";
import { fetchData } from "@/data/fetch";

export default async function Page(props: {
  params: { category: string; type: "categories" | "tags" };
}) {
  return (
    <PaginatedCategories
      pageNumber={0}
      slug={props.params.category}
      type={props.params.type}
    />
  );
}

export async function generateMetadata(params: {
  params: { category: string; type: "categories" | "tags" };
}): Promise<Metadata> {
  const categories = await getCategory(
    params.params.category,
    params.params.type
  );
  if (!categories) {
    return {};
  }
  return {
    title: `${categories.name} | Yoseph.tech`,
    description: categories.description ?? `My thought on ${categories.name}`,
  };
}

export async function generateStaticParams(): Promise<
  { category: string; type: "categories" | "type" }[]
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

  return [
    ...data.data.categories.nodes.map((category: { slug: string }) => ({
      type: "categories",
      category: category.slug,
    })),
    ...data.data.tags.nodes.map((category: { slug: string }) => ({
      type: "tags",
      category: category.slug,
    })),
  ];
}
export const revalidate = 43200;
