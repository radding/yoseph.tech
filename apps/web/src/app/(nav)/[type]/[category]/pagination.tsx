import { Pagination } from "@/app/components/pagination";
import { PostLink } from "@/app/components/postLink";
import { getCategory } from "@/data/category/getCategory";
import { notFound } from "next/navigation";

export const PaginatedCategories = async (props: {
  pageNumber: number;
  slug: string;
  type: "categories" | "tags";
}) => {
  const category = await getCategory(props.slug, props.type);
  if (!category) {
    return notFound();
  }
  const page = category.posts[props.pageNumber];
  if (page === undefined) {
    return notFound();
  }
  return (
    <div>
      <main className="py-6 lg:w-8/12 mx-auto">
        <section className="lg:my-20">
          <h1 className="text-6xl text-center">{category.name}</h1>
          <p className="text-2xl text-center mt-3">
            {category.description ??
              `See all posts related to ${category.name}`}
          </p>
        </section>
        <section className="mt-6">
          {page.map((post, ndx) => (
            <PostLink post={post} key={ndx} />
          ))}
        </section>
      </main>
      <div className="absolute bottom-[0%] w-full">
        <Pagination
          totalCount={category.posts.reduce(
            (acc, posts) => acc + posts.length,
            0
          )}
          pageNumber={props.pageNumber}
          currentPageLength={page.length}
          numberOfPages={category.posts.length}
          generatePageLink={(pageNum) =>
            `/categories/${props.slug}/page/${pageNum}`
          }
          hideSummary
        />
      </div>
    </div>
  );
};
