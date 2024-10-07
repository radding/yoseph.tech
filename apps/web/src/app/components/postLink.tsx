import { LightPost } from "@/data/lightPosts";
import { format } from "date-fns";
import { Link } from "./links";

export const PostLink = ({ post }: { post: LightPost }) => (
  <Link
    link={{
      linkType: "internal-page",
      text: "",
      page: { __typename: "Post", ...post },
    }}
    className="group rounded-lg transition-colors hover:text-indigo-400"
  >
    <div className="px-5 py-7 flex flex-col">
      <h2 className="text-3xl mb-3">{post.title}</h2>
      <p className="text-sm mb-3">
        Posted in {post.categories[0].name} on{" "}
        {format(post.date, "MMM do, yyyy")}
      </p>
      <div className="mb-3 prose prose-invert">{post.excerpt}</div>
      <div className="font-extrabold">
        Read More
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </div>
    </div>
  </Link>
);
