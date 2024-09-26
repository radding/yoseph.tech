import z from "zod";
import { DateString, HtmlString, NullishHtmlString } from "./zodutils";
import { LinkSchema } from "./links";

export const LightPost = z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: HtmlString,
    date: DateString,
    categories: z.object({
        nodes: z.array(z.object({
            slug: z.string(),
            name: z.string().optional(),
        })),
    }).transform(obj => obj.nodes),
});
export type LightPost = z.infer<typeof LightPost>;

export const PageObject = z.object({
    id: z.string(),
    status: z.enum(["publish", "draft"]),
    hero: z.object({
        title: z.string().nullish(),
        content: NullishHtmlString,
        buttonGroups: z.array(LinkSchema.and(z.object({
            content: HtmlString,
        }))).nullish().transform(bg => bg ?? [])
    }),
    page_data: z.object({
        excerpt: z.string(),
    }).nullish(),
    page_sections: z.object({
        sections: z.array(z.object({
            title: z.string(),
            byline: NullishHtmlString,
            posts: z.array(z.object({
                post: LightPost,
            })).transform(postsObj => postsObj.map(p => p.post)),
        })).nullish().transform(sect => sect ?? [])
    }).transform(sections => sections.sections)
});