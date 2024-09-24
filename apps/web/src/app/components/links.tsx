import React, { PropsWithChildren } from "react";
import NextLink from "next/link";
import {
  InternalHardcodedPageLink,
  InternalPageLink,
  InternalTaxonomyLink,
  LinkWithDropdownSchema,
} from "../../data/links";

type LinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  link: LinkWithDropdownSchema;
};

const generateLink = (
  link: InternalPageLink | InternalTaxonomyLink | InternalHardcodedPageLink
): string => {
  switch (link.linkType) {
    case "internal-page":
      switch (link.page.__typename) {
        case "Page":
          return `/${link.page.slug}`;
        case "Post":
          return `/posts/${link.page.categories[0].slug}/${link.page.slug}`;
      }
    case "internal-taxonomy":
      return `/categories/${link.taxonomy[0].slug}`;
    case "internal-hardcoded":
      return link.pagePath;
  }
};

export const Link = ({ link, ...props }: PropsWithChildren<LinkProps>) => {
  if (link.linkType === "external") {
    return (
      <a href={link.link} {...props}>
        {props.children ?? link.text}
      </a>
    );
  }
  if (
    link.linkType === "internal-page" ||
    link.linkType === "internal-taxonomy" ||
    link.linkType === "internal-hardcoded"
  ) {
    return (
      <NextLink href={generateLink(link)} {...props}>
        {props.children ?? link.text}
      </NextLink>
    );
  }
  return null;
};
