import z from "zod";
import { DateString, HtmlString, NullishHtmlString } from "./zodutils";
import { fetchData } from "./fetch";
import { cache } from "react";
import { LinkSchema } from "./links";
import { LightPost } from "./lightPosts";

const query = `
{
  siteMetadatas {
    nodes {
      metadata {
        isActive
        mainPage {
          ... on Page {
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
                      date
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
                mainPage: z.object({
                    hero: z.object({
                        title: z.string(),
                        content: NullishHtmlString,
                        buttonGroups: z.array(LinkSchema.and(z.object({
                            content: HtmlString,
                        })))
                    }),
                    page_sections: z.object({
                        sections: z.array(z.object({
                            title: z.string(),
                            byline: NullishHtmlString,
                            posts: z.array(z.object({
                                post: LightPost,
                            })).transform(postsObj => postsObj.map(p => p.post)),
                        }))
                    }).transform(sections => sections.sections)
                }),
                
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