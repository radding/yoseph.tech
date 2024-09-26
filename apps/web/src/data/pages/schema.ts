import { PageObject } from "../lightPosts";
import z from "zod";
import { TailwindifyContent } from "../zodutils";
import { fetchData } from "../fetch";
import { getAllPostsQuery, query } from "./query";
import path from "path";
import { cache } from "react";
import { getSiteMetadata } from "../getSiteMetadata";
import { getHomePageData } from "../getHomePageContent";

export const PageSchema = PageObject.extend({
    content: TailwindifyContent,
    uri: z.string(),
    title: z.string(),
    page_data: z.object({
        excerpt: z.string(),
    })
});
export type PageSchema = z.infer<typeof PageSchema>

const PageResponse = z.object({
    page: PageSchema,
}).transform(p => p.page);


export const getPage = cache(async (ids: string[]) => {
    const data = await fetchData(query, { uri: path.join(...ids)});
    console.log(data)
    if (!data || !data.data || !data.data.page) {
        return null;
    }
    return PageResponse.parse(data.data)
})

export const AllPagesSchema = z.object({
    pages: z.object({
        nodes: z.array(z.object({
            uri: z.string(),
            id: z.string(),
        })),
        pageInfo: z.object({
            endCursor: z.string().nullish(),
            hasNextPage: z.boolean(),
        })
    })
});

export type AllPagesSchema = z.infer<typeof AllPagesSchema>;

export const getAllPages = cache(async () => {
    const siteMetadata = await getHomePageData();
    let cursor = undefined;
    const pages: AllPagesSchema["pages"]["nodes"] = [];
    do {
        const data = await fetchData(getAllPostsQuery, { cursor });
        const pagesResponse = AllPagesSchema.parse(data.data);
        if (pagesResponse.pages.pageInfo.hasNextPage) {
            cursor = pagesResponse.pages.pageInfo.endCursor;
        } else {
            cursor = undefined
        }
        pages.push(...pagesResponse.pages.nodes.filter(page => page.id !== siteMetadata.id))
    } while (cursor !== undefined);
    return pages;
})