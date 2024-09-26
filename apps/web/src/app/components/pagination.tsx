import classNames from "classnames";
import Link from "next/link";

export const Pagination = ({
  pageNumber,
  currentPageLength,
  totalCount,
  numberOfPages,
  truncateAt,
  generatePageLink,
  hideSummary,
}: {
  pageNumber: number;
  numberOfPages: number;
  currentPageLength: number;
  totalCount: number;
  truncateAt?: number;
  generatePageLink: (pageNumber: number) => string;
  hideSummary?: boolean;
}) => {
  let paginations = [];
  if (truncateAt === undefined) {
    truncateAt = Infinity;
  }
  if (numberOfPages === 1) {
    return null;
  }
  for (let ndx = 0; ndx < numberOfPages; ndx++) {
    paginations.push(
      <Link
        key={ndx}
        href={generatePageLink(ndx + 1)}
        aria-current={pageNumber - 1 === ndx ? "page" : undefined}
        className={classNames(
          "relative z-10 inline-flex items-center px-4 py-2 text-sm focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          {
            "bg-indigo-600 font-semibold text-white": pageNumber - 1 === ndx,
          },
          {
            "ring-1 ring-inset ring-gray-300 hover:bg-indigo-400 focus:z-20 focus:outline-offset-0":
              pageNumber - 1 !== ndx,
          }
        )}
      >
        {ndx + 1}
      </Link>
    );
  }

  return (
    <div
      className={classNames("hidden sm:flex sm:flex-1 sm:items-center w-100", {
        "justify-center": hideSummary,
        "sm:justify-between": !hideSummary,
      })}
    >
      {!hideSummary && (
        <div>
          <p className="text-sm text-gray-300">
            Showing
            <span className="font-medium mx-3">
              {1 + (pageNumber - 1) * 10}
            </span>
            to
            <span className="font-medium mx-3">
              {Math.max(currentPageLength, 10 + (pageNumber - 1) * 10)}
            </span>
            of
            <span className="font-medium mx-3">{totalCount}</span>
            results
          </p>
        </div>
      )}
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {/* {pageNumber > 1 ? ( */}
          {numberOfPages > truncateAt && (
            <Link
              href={pageNumber > 1 ? generatePageLink(1) : ""}
              className={classNames(
                "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0",
                {
                  "cursor-not-allowed": pageNumber === 1,
                },
                {
                  "hover:bg-indigo-400": pageNumber !== 1,
                }
              )}
              aria-disabled={pageNumber === 1}
            >
              <span className="sr-only">First Page</span>
              &lt;&lt;
            </Link>
          )}
          <Link
            href={pageNumber > 1 ? generatePageLink(pageNumber - 1) : ""}
            className={classNames(
              "relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 px-4 py-2",
              {
                "cursor-not-allowed": pageNumber === 1,
              },
              {
                "hover:bg-indigo-400": pageNumber !== 1,
              },
              {
                "rounded-l-md": numberOfPages < truncateAt,
              }
            )}
            aria-disabled={pageNumber === 1}
          >
            <span className="sr-only">Previous</span>
            &lt;
          </Link>

          {paginations}

          <Link
            href={
              pageNumber !== numberOfPages
                ? generatePageLink(pageNumber + 1)
                : ""
            }
            className={classNames(
              "relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 px-4 py-2",
              {
                "cursor-not-allowed": pageNumber === numberOfPages,
              },
              {
                "hover:bg-indigo-400": pageNumber !== numberOfPages,
              },
              {
                "rounded-r-md": numberOfPages < truncateAt,
              }
            )}
            aria-disabled={pageNumber === numberOfPages}
          >
            <span className="sr-only">Next</span>
            &gt;
          </Link>
          {numberOfPages > truncateAt && (
            <Link
              href={generatePageLink(numberOfPages)}
              className={classNames(
                "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0",
                {
                  "cursor-not-allowed": pageNumber === numberOfPages,
                },
                {
                  "hover:bg-indigo-400": pageNumber !== numberOfPages,
                }
              )}
              aria-disabled={pageNumber === numberOfPages}
            >
              <span className="sr-only">Last Page</span>
              &gt;&gt;
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
