import z from "zod";

const LinkedContentSchema = z.discriminatedUnion("__typename", [
    z.object({
        __typename: z.literal("Page"),
        slug: z.string(),
        uri: z.string(),
    }),
    z.object({
        __typename: z.literal("Post"),
        slug: z.string(),
        categories: z.object({
            nodes: z.array(z.object({
                name: z.string().optional(),
                slug: z.string(),
            }))
        }).transform(c => c.nodes),
    })
]);

export type LinkedContentSchema = z.infer<typeof LinkedContentSchema>;

const InternalTaxonomyLink = z.object({
    linkType: z.literal("internal-taxonomy"),
    text: z.string(),
    taxonomy: z.array(z.object({
    slug: z.string(),
    }))
});
export type InternalTaxonomyLink = z.infer<typeof InternalTaxonomyLink>

const InternalPageLink = z.object({
    linkType: z.literal("internal-page"),
    text: z.string(),
    page: LinkedContentSchema,
});
export type InternalPageLink = z.infer<typeof InternalPageLink>;

const InternalHardcodedPageLink = z.object({
    linkType: z.literal("internal-hardcoded"),
    text: z.string(),
    pagePath: z.string(),
});
export type InternalHardcodedPageLink = z.infer<typeof InternalHardcodedPageLink>;
 
const ExternalLink = z.object({
    linkType: z.literal("external"),
    link: z.string().url(),
    text: z.string(),
})
export type ExternalLink = z.infer<typeof ExternalLink>;

export const LinkSchema = z.discriminatedUnion("linkType", [
    InternalPageLink,
    InternalTaxonomyLink,
    InternalHardcodedPageLink,
    ExternalLink,
]);
export type LinkSchema = z.infer<typeof LinkSchema>

export const LinkWithDropdownSchema =  z.discriminatedUnion("linkType", [
    InternalPageLink,
    InternalTaxonomyLink,
    InternalHardcodedPageLink,
    ExternalLink,
    z.object({
        linkType: z.literal("dropdown"),
        links: z.array(LinkSchema),
    })
]);
export type LinkWithDropdownSchema = z.infer<typeof LinkWithDropdownSchema>;