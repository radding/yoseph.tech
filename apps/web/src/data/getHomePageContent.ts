import z from "zod";
import { fetchData } from "./fetch";
import { cache } from "react";
import { PageObject } from "./lightPosts";

const query = `
{
  siteMetadatas {
    nodes {
      metadata {
        isActive
        mainPage {
          ... on Page {
            id
            status
            page_data {
              excerpt
            }
            hero {
              title
              content
              buttonGroups {
                text
                content
                link
                linkType
                pagePath: pagepath
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
            page_sections {
              sections {
                title
                byline
                posts {
                  post {
                    ... on Post {
                      title
                      slug
                      excerpt
                      rawExcerpt: excerpt
                      date
                      tags {
                        nodes {
                          slug
                          name
                        }
                      }
                      categories {
                        nodes {
                          name
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
      }
    }
  }
}
`

const HomePageSchema = z.object({
    siteMetadatas: z.object({
        nodes: z.array(z.object({
            metadata: z.object({
                isActive: z.boolean(),
                mainPage: PageObject,
            })
        }))
    }).transform(meta => meta.nodes.filter(node => node.metadata.isActive)[0].metadata.mainPage),
}).transform(meta => meta.siteMetadatas);

export type HomePageSchema = z.infer<typeof HomePageSchema>

const _fetch = async () => {
    const data = await fetchData(query);
    console.log(data);
    return HomePageSchema.parse(data.data);
}

export const getHomePageData = cache(_fetch);