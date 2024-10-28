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
      type={"categories"}
    />
  );
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
  const categoryInfo = await Promise.all(
    data.data.categories.nodes.map(async (category: { slug: string }) => {
      const pages = await getCategory(category.slug, "categories");
      return {
        type: "categories",
        category: category.slug,
        pages: pages?.posts.length,
      };
    })
  );
  const categoryPage: {
    category: string;
    type: "categories" | "tags";
    page: string;
  }[] = categoryInfo.flatMap((category) => {
    for (let i = 0; i < category.pages; i++) {
      return {
        ...category,
        page: (i + 1).toString(),
      };
    }
  });
  return [...categoryPage];
}

export const revalidate = 43200;
