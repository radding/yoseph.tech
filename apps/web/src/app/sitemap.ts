import { Category, getCategory } from "@/data/category/getCategory";
import { fetchData } from "@/data/fetch";
import { getAllPages } from "@/data/pages/schema";
import { fetchAllPosts } from "@/data/posts";
import { MetadataRoute } from "next";

const BASE_URL = "https://www.yoseph.tech";

export default async function sitemap(): Promise<any> {
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
    const allCategories: Array<Category | null> = await Promise.all(categories_tags.data.categories.nodes.map((category: {slug: string}) => getCategory(category.slug, "categories")))
    const allTags: Array<Category | null> = await Promise.all(categories_tags.data.tags.nodes.map((category: {slug: string}) => getCategory(category.slug, "tags")))
    const allPostPages: MetadataRoute.Sitemap = posts.flatMap((posts => posts.map(post => ({
        url: `${BASE_URL}/posts/${post.categories[0].slug}/${post.slug}`,
        changeFrequency: "monthly",
    }))));
    const paginatedPosts = posts.map((_, ndx): MetadataRoute.Sitemap[number] => ({
      url: `${BASE_URL}/posts/${ndx + 1}`,
      changeFrequency: "daily",
      priority: .4
    }))
    const categoriesPages= allCategories.filter(category => category !== null).flatMap((category) => {
      const allPages = category!.posts.map((_, ndx): MetadataRoute.Sitemap[number] => ({
        url: `${BASE_URL}/categories/${category.slug}/${ndx + 1}`,
        changeFrequency: "daily",
        priority: .4,
      }));
      return [{ url: `${BASE_URL}/categories/${category?.slug}`, changeFrequency: "daily", priority: .4}, ...allPages]
    })
    const tagPages: MetadataRoute.Sitemap = allTags.filter(category => category !== null).flatMap((category) => {
      const allPages = category!.posts.map((_, ndx): MetadataRoute.Sitemap[number] => ({
        url: `${BASE_URL}/tags/${category.slug}/${ndx + 1}`,
        changeFrequency: "daily",
        priority: .4,
      }));
      return [{ url: `${BASE_URL}/tags/${category?.slug}`, changeFrequency: "daily", priority: .4}, ...allPages]
    })
    const allPages: MetadataRoute.Sitemap = pages.map(page => ({
        url: `${BASE_URL}${page.uri}`,
        changeFrequency: "monthly",
        priority: .9,
    }))
    return [{
        url: `${BASE_URL}/posts`,
        changeFrequency: "daily",
        priority: .7
    }, {
        url: BASE_URL,
        changeFrequency: "yearly",
        priority: 1,
    },
    ...allPostPages,
    ...allPages,
    ...categoriesPages,
    ...tagPages,
    ...paginatedPosts,
]
}