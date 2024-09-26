import { fetchData } from "@/data/fetch";
import { getAllPages } from "@/data/pages/schema";
import { fetchAllPosts } from "@/data/posts";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [
        posts,
        categories_tags,
        pages
    ] = await Promise.all([fetchAllPosts(), fetchData(`query {
      categories {
        nodes {
          slug
        }
      }
      tags {
        nodes {
          slug
        }
      }
    }`), getAllPages()])
    const allPostPages: MetadataRoute.Sitemap = posts.flatMap((posts => posts.map(post => ({
        url: `https://yoseph.tech/posts/${post.categories[0].slug}/${post.slug}`,
        changeFrequency: "monthly",
    }))));
    const allCategoryTags = categories_tags.data.categories.nodes.map((cat: {slug: string}) => ({
        url: `https://yoseph.tech/categories/${cat.slug}`,
        changeFrequency: "daily",
        priority: .4,
    }))
    const allTags = categories_tags.data.tags.nodes.map((cat: {slug: string}) => ({
        url: `https://yoseph.tech/tags/${cat.slug}`,
        changeFrequency: "daily",
        priority: .4,
    }))
    const allPages: MetadataRoute.Sitemap = pages.map(page => ({
        url: `https://yoseph.tech${page.uri}`,
        changeFrequency: "monthly",
        priority: .9,
    }))
    return [{
        url: "https://yoseph.tech/posts",
        changeFrequency: "daily",
        priority: .7
    }, {
        url: "https://yoseph.tech",
        changeFrequency: "yearly",
        priority: 1,
    },
    ...allPostPages,
    ...allPages,
    ...allCategoryTags,
    ...allTags,
]
}