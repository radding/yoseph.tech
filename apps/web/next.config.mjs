/** @type {import('next').NextConfig} */
export const fetchData = async (query, variables) => {
  const data = await fetch(
    "https://content-shuttl.herokuapp.com/yoseph-tech/index.php?graphql",
    {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const d = await data.json();
  return d;
};

const generateRedirects = (source) => ({
  source,
  destination: `/posts${source}`,
  permanent: true,
});
const pages = [
  "/graphql/authorization-in-graphql",
  "/graphql/serverless-graphql-at-the-edge",
  "/graphql/graphql-as-an-extension-of-conways-law",
  "/compilers/completely-useless-fun-project-building-the-parser",
  "/compilers/completely-useless-fun-project-parts-of-the-compiler",
  "/engineering/from-test-driven-development-to-test-driven-design",
  "/python/event-driven-programing-in-django",
  "/compilers/completely-useless-fun-project-building-a-new-programming-language",
  "/engineering/building-production-code",
  "/raspberry-pi/building-an-arcade-controller",
  "/raspberry-pi/building-a-raspberry-pi-arcade-machine",
  "/emerging-technology/my-experience-with-net-core",
];
const nextConfig = {
  redirects: async () => {
    const data = await fetchData(`query {
        categories {
          nodes {
            slug
          }
        }
      }`);
    const posts = data.data.categories.nodes.map((node) => ({
      source: `/${node.slug}`,
      destination: `/categories/${node.slug}`,
      permanent: true,
    }));
    return [
      {
        source: "/about",
        destination: "/about-me",
        permanent: true,
      },
      ...posts,
      ...pages.map(generateRedirects),
    ];
  },
};

export default nextConfig;
