import { cache } from "react";
import z from "zod";

import { LinkWithDropdownSchema } from "./links";
import { fetchData } from "./fetch";

const query = `
{
  siteMetadatas {
    nodes {
      metadata {
        isActive
        title
        description
        header {
          __typename
          ... on Header {
            header {
              links {
                link
                links {
                  linkType
                  text
                  page {
                    __typename
                    ... on Page {
                      slug
                      uri
                    }
                    ... on Post {
                      slug
                      categories {
                        nodes {
                          name
                          slug
                        }
                      }
                    }
                  }
                  taxonomy {
                    description
                    slug
                  }
                }
                linkType
                text
                page {
                  __typename
                  ... on Page {
                    slug
                    uri
                  }
                  ... on Post {
                    slug
                    categories {
                      nodes {
                        name
                        slug
                      }
                    }
                  }
                }
                taxonomy {
                  description
                  slug
                }
              }
            }
          }
        }
      }
    }
  }
}

`



export const MetadataSchema = z.object({
    isActive: z.boolean(),
    title: z.string().optional(),
    description: z.string().optional(),
    header: z.object({
        header: z.object({
            links: z.array(LinkWithDropdownSchema)
        })
    })
});

const schema = z.object({
    nodes: z.array(z.object({
        metadata: MetadataSchema,
    }))
}).transform(d => d.nodes.filter(n => n.metadata.isActive)[0].metadata);

async function _getSiteMetadata() {
    const data = await fetchData(query);
    const metadata = schema.parse(data.data.siteMetadatas);
    return metadata;
}

export const getSiteMetadata = cache(_getSiteMetadata);