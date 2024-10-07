import { cache } from "react";
import { fetchData } from "../fetch";
import { specificCategoryQuery } from "./queries";
import { z } from "zod";
import { LightPost } from "../lightPosts";
import { specificTagQuery } from "../tags/queries";

const CategoryPage = z.object({
    description: z.string().nullish(),
    slug: z.string(),
    name: z.string(),
    posts: z.object({
        nodes: z.array(LightPost),
        pageInfo: z.object({
            hasNextPage: z.boolean(),
            endCursor: z.string().nullish(),
        }),
    })
});
type CategoryPage = z.infer<typeof CategoryPage>;
export type Category = Omit<CategoryPage, "posts"> & {
    posts: LightPost[][]
}

const _fetchPage = async (slug: string, type: "categories" | "tags", cursor?: string) => {
    let data = await fetchData(type === "categories" ? specificCategoryQuery: specificTagQuery, { cursor, slug });
    data = type === "categories" ? data.data.category : data.data.tag;
    return CategoryPage.parse(data);
}

const _fetchPages = async (slug: string, type: "categories" | "tags"): Promise<Category> => {
    let cursor: string | undefined = undefined;
    let categoryData: CategoryPage | null = null;
    const posts: LightPost[][] = [];
    do {
        const data = await _fetchPage(slug, type, cursor);
        categoryData = data;
        if (data.posts.pageInfo.hasNextPage) {
            cursor = data.posts.pageInfo.endCursor!;
        } else {
            cursor = undefined;
        }
        posts.push(data.posts.nodes);
    } while(cursor !== undefined);
    return {
        ...categoryData,
        posts: posts,
    }
}

export const getCategoryNoCache = async (categorySlug: string, type: "categories" | "tags"): Promise<Category | null> => {
    try {
        return _fetchPages(categorySlug, type);
    } catch(e) {
        console.error(`Error fetching category: ${e}`);
        return null;
    }
}

export const getCategory = cache(getCategoryNoCache)