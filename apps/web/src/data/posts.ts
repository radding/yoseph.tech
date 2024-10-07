import { z } from "zod";
import { LightPost } from "./lightPosts";
import { fetchData } from "./fetch";
import { cache } from "react";

const query = `
query ($after: String, $categoryName: String) {
  posts(first: 10, after: $after, where: {categoryName: $categoryName}) {
    nodes {
      ... on Post {
        title
        slug
        excerpt
        rawExcerpt: excerpt
        date
        tags {
          nodes {
            name
            slug
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
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
`;

const PostQuery = z.object({
    posts: z.object({
        nodes: z.array(LightPost),
        pageInfo: z.object({
            endCursor: z.string().nullish(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            startCursor: z.string(),
        })
    }),
}).transform(x => ({
    posts: x.posts.nodes,
    pageInfo: x.posts.pageInfo,
}));

const _fetchPosts = async (after?: string, categoryName?: string) => {
    const data = await fetchData(query, { after, categoryName });
    return PostQuery.parse(data.data);
}

const _fetchAllPosts = async (categoryName?: string) => {
    let cursor: string | undefined = undefined;
    const posts: LightPost[][] = [];
    do {
        const data = await _fetchPosts(cursor, categoryName);
        if (data.pageInfo.hasNextPage) {
            cursor = data.pageInfo.endCursor!;
        } else {
            cursor = undefined;
        }
        posts.push(data.posts);
    } while (cursor !== undefined);
    return posts;
}

export const fetchAllPosts = cache(_fetchAllPosts);