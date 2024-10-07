import { getSiteMetadata } from "@/data/getSiteMetadata";
import { fetchAllPosts } from "@/data/posts";
import RSS from "rss"

export async function GET() {
    const [siteMetadata, allPosts] = await Promise.all([getSiteMetadata(), fetchAllPosts()]);

    const feed = new RSS({
        title: "Yoseph.tech",
        description: siteMetadata.description ?? "Yoseph's personal site",
        feed_url: "https://www.yoseph.tech/rss.xml",
        site_url: "https://www.yoseph.tech/",
        managingEditor: "Yoseph@shuttl.io (Yoseph Radding)",
        webMaster: "Yoseph@shuttl.io (Yoseph Radding)",
        copyright: `Copyright ${new Date().getFullYear().toString()}, Yoseph Radding`,
        language: 'en-US',
        pubDate: new Date().toUTCString(),
        ttl: 60,
    });

    allPosts.forEach(postPage => {
        postPage.forEach(post => {
            feed.item({
                title: post.title,
                description: post.rawExcerpt.replace("<p>", "").replace("</p>", ""),
                url: `https://www.yoseph.tech/posts/${post.categories[0].slug}/${post.slug}`,
                author: "Yoseph Radding",
                categories: [...post.categories.map(cat => cat.name ?? cat.slug), ...post.tags.map(tag => tag.name ?? tag.slug)],
                date: post.date,
                
            })
        })
    })

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}