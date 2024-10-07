import { getAllPostsQuery } from "@/data/pages/query";
import { fetchAllPosts } from "@/data/posts";
import { PostLink } from "./postLink";

export const LatestPosts = async (props: { number?: number }) => {
  const allPosts = await fetchAllPosts();
  const posts = allPosts.flat().slice(0, props.number ?? 4);
  return (
    <>
      {posts.map((post, ndx) => {
        return <PostLink post={post} key={ndx} />;
      })}
    </>
  );
};
