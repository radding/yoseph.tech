import { z } from "zod";
import { DateString, HtmlString, HtmlStringWithReplacer } from "./zodutils";
import { LightPost } from "./lightPosts";
import { cache } from "react";
import { fetchData } from "./fetch";
import { el } from "date-fns/locale";

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
    content(format: RENDERED)
    title(format: RENDERED)
    relatedPosts {
      nodes {
        ... on Post {
          title
          slug
          excerpt
          date
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
        }).transform(f => f.node),
        excerpt: HtmlString,
        content: HtmlStringWithReplacer(elem => {
            switch (elem.tagName) {
            case "p": {
                elem.attribs.class = "mb-5";
                break;
            }
            case "figure": {
                elem.attribs.class = "mb-5 text-center"
                break;
            }
            case "img": {
                if ((elem.parent as Element | null)?.tagName === "figure") {
                    elem.attribs.class = "mx-auto";
                }
                break;
            }
            case "code": {
                if ((elem.parent as Element | null)?.tagName !== "pre") {
                    elem.attribs.class = "bg-slate-200 px-2"
                }
                break;
            }
            case "pre": {
                elem.attribs.class = "bg-slate-200 w-2/4 p-5 my-0 mx-auto mb-5";
                break;
            }
            case "h2": {
                elem.attribs.class = "text-4xl text-center pb-7 font-sans"
                break;
            }
            case "h3": {
                elem.attribs.class = "text-3xl pb-7";
                break
            }
            case "h4": {
                elem.attribs.class = "text-1xl pb-5"
                break;
            }
            case "h5": {
                elem.attribs.class = "text-lg pb-5"
                break;
            }
            case "h6": {
                elem.attribs.class = "text-base font-extrabold pb-5"
            }
            }
            return elem;
        }),
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