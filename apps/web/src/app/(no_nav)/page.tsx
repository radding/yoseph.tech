import { getHomePageData } from "@/data/getHomePageContent";
import Image from "next/image";
import { Link } from "../components/links";
import { format } from "date-fns";
import { Metadata } from "next";

export default async function Home() {
  const homePage = await getHomePageData();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between md:p-24">
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <h1 className="text-4xl">{homePage.hero.title}</h1>
        </div>

        <div>{homePage.hero.content}</div>

        <div
          className={`mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left`}
        >
          {homePage.hero.buttonGroups.map((button, ndx) => (
            <Link
              key={ndx}
              link={button}
              target={button.linkType === "external" ? "_blank" : "_self"}
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {button.text}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <div className="m-0 max-w-[30ch] text-sm opacity-50">
                {button.content}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <section className="md:px-24 px-12">
        {homePage.page_sections.map((section, ndx) => (
          <div key={ndx} className="pb-16">
            <h3 className="text-3xl pb-8">{section.title}</h3>
            <div className="md:grid md:grid-cols-4 md:gap-4" key={ndx}>
              {section.posts.map((post, id) => (
                <Link
                  key={id}
                  link={{
                    linkType: "internal-page",
                    text: "",
                    page: { __typename: "Post", ...post },
                  }}
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                  <div className="pb-6">
                    <h5 className="text-2xl">{post.title}</h5>
                    <p className="text-sm">
                      Posted on {format(post.date, "MMM do, yyyy")} in{" "}
                      {post.categories[0].name}
                    </p>
                  </div>
                  <div className="text-base opacity-50 md:mb-4">
                    {post.excerpt}
                  </div>
                  <div>Read More -&gt;</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export const revalidate = 43200;

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePageData();
  return {
    title: "Yoseph.tech",
    description: homePage.page_data?.excerpt ?? "My Personal Website",
  };
}
