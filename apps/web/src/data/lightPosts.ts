import z from "zod";
import { DateString, HtmlString } from "./zodutils";

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