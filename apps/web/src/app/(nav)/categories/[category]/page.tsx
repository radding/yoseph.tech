import { getCategory } from "@/data/category/getCategory";
import { notFound } from "next/navigation";

export default async function Page(props: { params: { category: string } }) {
  const category = await getCategory(props.params.category);
  if (category === null) {
    return notFound();
  }
  return <h1>Posts related to {category.name}</h1>;
}
