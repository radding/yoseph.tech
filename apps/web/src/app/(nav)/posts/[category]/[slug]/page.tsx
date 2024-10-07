import { Link } from "@/app/components/links";
import NextLink from "next/link";
import { PostLink } from "@/app/components/postLink";
import { fetchPost } from "@/data/postQuery";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchAllPosts } from "@/data/posts";
import PrismLoader from "@/app/prism";
import { LatestPosts } from "@/app/components/LatestPosts";

type PageProps = {
  params: {
    category: string;
    slug: string;
  };
};

export default async function Page(props: PageProps) {
  const post = await fetchPost(props.params.slug);
  if (post === null) {
    return notFound();
  }
  return (
    <main>
      <article className="md:mt-[20vh]">
        <div className="text-center pt-10 md:px-[20rem]">
          <h1 className="text-4xl mb-5">{post.title}</h1>
          <p className="text-sm mb-5">
            Posted on {format(post.date, "MMM do, yyyy")} in{" "}
            <Link
              link={{
                taxonomy: post.categories,
                linkType: "internal-taxonomy",
                text: "",
              }}
              className="hover:text-indigo-400 text-green-400"
            >
              {post.categories[0].name}
            </Link>
          </p>
        </div>

        <div className=" md:pb-10 md:pt-10 px-3 md:px-6">
          <div className="prose lg:prose-xl mx-auto prose-invert">
            {post.excerpt}
          </div>
          <div className="pt-6 pb-6 lg:pb-0">
            <div className="flex justify-center flex-wrap">
              {post.tags.map((tag, ndx) => {
                return (
                  <NextLink
                    href={`/tags/${tag.slug}`}
                    key={ndx}
                    className="py-2 px-4 shadow-md text-black no-underline rounded-full bg-indigo-400 font-sans font-semibold text-sm border-blue btn-primary hover:text-white hover:bg-indigo-600 focus:outline-none active:shadow-none mr-2 "
                  >
                    {tag.name}
                  </NextLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full bg-white py-5 ">
          <div className="prose lg:prose-xl prose-h2:text-center mx-auto px-3">
            {post.content}
          </div>
        </div>
      </article>
      <div className="py-10 px-5 lg:w-[150ch] mx-auto">
        <h3 className="text-3xl text-center">Read More Related Posts</h3>
        {post.relatedPosts.map((post, ndx) => (
          <div className="max-w-prose" key={ndx}>
            <PostLink post={post} />
          </div>
        ))}

        <div className="py-10 px-5 lg:w-[150ch] mx-auto">
          <h3 className="text-3xl text-center">Read Latest Posts</h3>
          <LatestPosts />
        </div>
      </div>
      <PrismLoader />
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await fetchPost(params.slug);
  if (page === null) {
    return {};
  }
  console.log("description", page.rawExcerpt);
  return {
    title: page?.title,
    description: page.rawExcerpt ?? page.exerpt2,
    creator: "Yoseph Radding",
    publisher: "Yoseph Radding",
    alternates: {
      canonical: `https://www.yoseph.tech/posts/${page.categories[0].slug}/${page.slug}`,
    },
    openGraph: {
      images: page.featuredImage?.mediaItemUrl,
    },
    authors: [{ name: "Yoseph Radding", url: "https://yoseph.tech/about-me" }],
  };
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const posts = await fetchAllPosts();
  return posts.flatMap((posts) =>
    posts.map((post) => ({
      category: post.categories[0].slug,
      slug: post.slug,
    }))
  );
}

export const revalidate = 43200;
