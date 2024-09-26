import { Link } from "@/app/components/links";
import { fetchData } from "@/data/fetch";
import { getAllPages, getPage } from "@/data/pages/schema";
import classNames from "classnames";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(params: { params: { pages: string[] } }) {
  const data = await getPage(params.params.pages);
  if (data === null) {
    return notFound();
  }
  return (
    <>
      <section
        className={classNames(
          "flex flex-col items-center justify-between md:p-24",
          {
            "min-h-full": data.hero.buttonGroups.length > 0,
            "min-h-[70vh]": data.hero.buttonGroups.length === 0,
          }
        )}
      >
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <h1 className="text-4xl">{data.hero.title}</h1>
        </div>

        <div className="lg:w-7/12 w-10/12 text-center">{data.hero.content}</div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          {data.hero.buttonGroups.map((button, ndx) => (
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
      </section>
      <main className="lg:w-7/12 mx-auto pb-5">{data.content}</main>
    </>
  );
}

export async function generateMetadata(props: {
  params: { pages: string[] };
}): Promise<Metadata> {
  const page = await getPage(props.params.pages);
  if (page === null) {
    return {};
  }
  return {
    title: page.hero.title ?? page.title,
    description: page.page_data?.excerpt,
  };
}

export async function generateStaticParams(): Promise<{ pages: string[] }[]> {
  const pages = await getAllPages();
  const spltPages = pages.map((page) => ({
    pages: page.uri.split("/").filter((part) => part !== ""),
  }));
  console.log("pages", spltPages);
  return spltPages;
}

export const revalidate = 43200;
