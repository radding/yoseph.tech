import { fetchAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import classNames from "classnames";
import { Pagination } from "@/app/components/pagination";
import { Link } from "@/app/components/links";
import { format } from "date-fns";
import { PostLink } from "@/app/components/postLink";

type PageinatedPostTypes = {
  pageNumber: number;
  category?: string;
};

export const PaginatedPosts = async ({
  pageNumber,
  category,
}: PageinatedPostTypes) => {
  const allPages = await fetchAllPosts(category);
  console.log(pageNumber, allPages.length);
  if (pageNumber - 1 >= allPages.length) {
    return notFound();
  }
  const currentPage = allPages[pageNumber - 1];
  return (
    <div className="relative min-h-[90vh]">
      <main className="mb-5 md:px-20 md:pt-10 mx-auto lg:w-8/12">
        {currentPage.map((post, ndx) => {
          return <PostLink post={post} key={ndx} />;
        })}
      </main>
      <div className="absolute bottom-[0%] w-full">
        <Pagination
          totalCount={allPages.reduce((acc, posts) => acc + posts.length, 0)}
          pageNumber={pageNumber}
          currentPageLength={currentPage.length}
          numberOfPages={allPages.length}
          generatePageLink={(pageNum) => `/posts/page/${pageNum}`}
          hideSummary
        />
      </div>
    </div>
  );
};
