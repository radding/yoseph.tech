import { z } from "zod";
import { DateString, HtmlString, HtmlStringWithReplacer, TailwindifyContent } from "./zodutils";
import { LightPost } from "./lightPosts";
import { cache } from "react";
import { fetchData } from "./fetch";
import jsDom from "jsdom";

const query = `
query($slug: String) {
  postBy(slug: $slug) {
    categories {
      nodes {
        name
        slug
      }
    }
    slug
    featuredImage {
      node {
        altText
        caption
        mediaItemUrl
        sizes
        srcSet
      }
    }
    excerpt
    rawExcerpt: excerpt(format:RAW)
    exerpt2: excerpt
    content(format: RENDERED)
    title(format: RENDERED)
    relatedPosts {
      nodes {
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
              slug
            }
          }
        }
      }
    }
    date
    tags {
      nodes {
        slug
        name
      }
    }
  }
}`;

const Post = z.object({
    postBy: z.object({
        categories: z.object({
            nodes: z.array(z.object({
                name: z.string(),
                slug: z.string(),
            }))
        }).transform(nodes => nodes.nodes),
        slug: z.string(),
        featuredImage: z.object({
            node: z.object({
                altText: z.string(),
                caption: z.string().nullish(),
                mediaItemUrl: z.string().url(),
                sizes: z.string(),
                srcSet: z.string(),
            }),
        }).nullish().transform(f => f?.node),
        excerpt: HtmlString,
        rawExcerpt: z.string().nullish(),
        exerpt2: z.string().transform(x => {
          return x.replace("<p>", "").replace("</p>", "");
        }),
        content: TailwindifyContent,
        title: z.string(),
        date: DateString,
        tags: z.object({
            nodes: z.array(z.object({
                slug: z.string(),
                name: z.string(),
            }))
        }).transform(nodes => nodes.nodes),
        relatedPosts: z.object({
            nodes: z.array(LightPost)
        }).transform(nodes => nodes.nodes),
    })
});

export type Post = z.infer<typeof Post>;

export const fetchPost = cache(async (slug: string) => {
    const res = await fetchData(query, { slug });
    if (res.data === null) {
        return null;
    }
    const posts = Post.parse(res.data);
    return posts.postBy
})