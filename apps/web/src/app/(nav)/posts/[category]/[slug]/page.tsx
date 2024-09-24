import { Link } from "@/app/components/links";
import NextLink from "next/link";
import { PostLink } from "@/app/components/postLink";
import { fetchPost } from "@/data/postQuery";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
      <article className="md:mt-[20vh] mt-[30vh]">
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
              className="hover:text-indigo-400"
            >
              {post.categories[0].name}
            </Link>
          </p>
          <div className="bg-white text-black md:pb-10 md:pt-10 px-3 md:px-6">
            {post.excerpt}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 mt-6">
              {post.tags.map((tag, ndx) => {
                return (
                  <NextLink
                    href={`/tags/${tag.slug}`}
                    key={ndx}
                    className="py-2 px-4 shadow-md text-black no-underline rounded-full bg-indigo-400 font-sans font-semibold text-sm border-blue btn-primary hover:text-white hover:bg-indigo-600 focus:outline-none active:shadow-none mr-2"
                  >
                    {tag.name}
                  </NextLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white text-black py-10 md:px-[20rem] px-5">
          {post.content}
        </div>
      </article>
      <div className="py-10 md:px-20 px-5">
        <h3 className="text-3xl">Read More</h3>
        {post.relatedPosts.map((post, ndx) => (
          <PostLink post={post} key={ndx} />
        ))}
      </div>
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
  return {
    title: page?.title,
    description: page.excerpt.toString(),
    creator: "Yoseph Radding",
    publisher: "Yoseph Radding",
    alternates: {
      canonical: `/${page.categories[0].slug}/${page.slug}`,
    },
    openGraph: {
      images: page.featuredImage.mediaItemUrl,
    },
    authors: [{ name: "Yoseph Radding", url: "https://yoseph.tech/about-me" }],
  };
}
