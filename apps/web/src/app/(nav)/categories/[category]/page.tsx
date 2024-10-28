import { getCategory } from "@/data/category/getCategory";
import { notFound } from "next/navigation";
import { PaginatedCategories } from "./pagination";
import { Metadata } from "next";
import { fetchData } from "@/data/fetch";

export default async function Page(props: { params: { category: string } }) {
  <PaginatedCategories
    pageNumber={0}
    slug={props.params.category}
    type={"categories"}
  />;
}

export async function generateMetadata(params: {
  params: { category: string };
}): Promise<Metadata> {
  const categories = await getCategory(params.params.category, "categories");
  if (!categories) {
    return {};
  }
  return {
    title: `${categories.name} | Yoseph.tech`,
    description: categories.description ?? `My thought on ${categories.name}`,
    alternates: {
      canonical: {
        url: `https://www.yoseph.tech/categories/${params.params.category}`,
      },
    },
  };
}

export async function generateStaticParams(): Promise<{ category: string }[]> {
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
      category: category.slug,
    })),
  ];
}
export const revalidate = 43200;
