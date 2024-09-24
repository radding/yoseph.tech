import { cache } from "react";
import { fetchData } from "../fetch";
import { specificCategoryQuery } from "./queries";
import { z } from "zod";
import { LightPost } from "../lightPosts";

const CategoryPage = z.object({
    description: z.string().nullish(),
    slug: z.string(),
    name: z.string(),
    posts: z.object({
        nodes: z.array(LightPost),
        pageInfo: z.object({
            hasNextPage: z.boolean(),
            endCursor: z.string(),
        }),
    })
});
type CategoryPage = z.infer<typeof CategoryPage>;
export type Category = Omit<CategoryPage, "posts"> & {
    posts: LightPost[][]
}

const _fetchPage = async (slug: string, cursor?: string) => {
    const data = await fetchData(specificCategoryQuery, { cursor, slug });
    return CategoryPage.parse(data.data.category);
}

const _fetchPages = async (slug: string): Promise<Category> => {
    let cursor: string | undefined = undefined;
    let categoryData: CategoryPage | null = null;
    const posts: LightPost[][] = [];
    do {
        const data = await _fetchPage(slug, cursor);
        categoryData = data;
        if (data.posts.pageInfo.hasNextPage) {
            cursor = data.posts.pageInfo.endCursor;
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

export const getCategory = cache(async (categorySlug: string): Promise<Category | null> => {
    try {
        return _fetchPages(categorySlug);
    } catch(e) {
        console.error(`Error fetching category: ${e}`);
        return null;
    }
})