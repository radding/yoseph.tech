import { getCategory } from "@/data/category/getCategory";
import { sl } from "date-fns/locale";
import { notFound } from "next/navigation";

export const PaginatedCategories = async (props: {
  pageNumber: number;
  slug: string;
}) => {
  const category = await getCategory(props.slug);
  if (!category) {
    return notFound();
  }
  const page = category.posts[props.pageNumber];
  return (
    <main>
      <h1>{category.name}</h1>
      <div>{category.description}</div>
    </main>
  );
};
