import { getSiteMetadata } from "@/data/getSiteMetadata";
import { LinkWithDropdownSchema } from "@/data/links";
// import Imagdde from "next/image";
import { Link } from "./links";
import NextLink from "next/link";
import { CollapsibleButton } from "./collapsibleButton";

type Props = {
  minimial: boolean;
  activePage?: string;
};

export const Nav = async (props: Props = { minimial: false }) => {
  let topNav: LinkWithDropdownSchema[] = [];
  if (!props.minimial) {
    const metadata = await getSiteMetadata();
    topNav = metadata.header.header.links;
  }
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NextLink
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Yoseph.tech
          </span>
        </NextLink>

        <CollapsibleButton>
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {topNav.map((elem, ndx) => (
              <li key={ndx}>
                <Link
                  link={elem}
                  className="hover:cursor-pointer block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                />
              </li>
            ))}
          </ul>
        </CollapsibleButton>
      </div>
    </nav>
  );
};
