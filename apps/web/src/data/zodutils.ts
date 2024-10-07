import z from "zod";
import parse, { Element } from 'html-react-parser';
import slugify from "slugify";

export const NullishHtmlString = z.string().nullish().transform(arg => !!arg ? parse(arg) : null);
export const HtmlString = z.string().transform((arg) => parse(arg));
export const DateString = z.string().transform(arg => new Date(arg))

type DomElement = Element & { attribs : Record<string, string>};
export type Replacer = (element: Element, ndx?: number) => Element;
export const HtmlStringWithReplacer = (replacer?: Replacer) => {
    const base = z.string();
    if (replacer) {
        return base.transform(arg => parse(arg, {replace(node, ndx){
            return replacer(node as Element, ndx);
        }}))
    }
    return base.transform((arg) => parse(arg))
};

export const TailwindifyContent = HtmlStringWithReplacer(elem => {
    switch (elem.tagName) {
        // case "p": {
        //     elem.attribs.class = "mb-5 leading-relaxed";
        //     break;
        // }
        // case "figure": {
        //     elem.attribs.class = "mb-5 text-center"
        //     break;
        // }
        // case "img": {
        //     if ((elem.parent as Element | null)?.tagName === "figure") {
        //         elem.attribs.class = "mx-auto";
        //     }
        //     break;
        // }
        // case "a": {
        //     elem.attribs.class = "hover:text-blue-700"
        //     break;
        // }
        case "code": {
            if ((elem.parent as Element | null)?.tagName !== "pre") {
            } else {
                elem.attribs.class = (elem.parentNode as Element).attribs.class;
            }
            break;
        }
        case "pre": {
            const langague = (elem.attribs.class ?? "").split(" ").filter(s => /language-.*/.test(s)).join(" ");
            elem.attribs.class = langague;
            break;
        }
        // case "h2": {
        //     elem.attribs.id = slugify(elem.childNodes[0])
        //     break;
        // }
        // case "h3": {
        //     elem.attribs.class = "text-3xl py-7";
        //     break
        // }
        // case "h4": {
        //     elem.attribs.class = "text-1xl pb-5"
        //     break;
        // }
        // case "h5": {
        //     elem.attribs.class = "text-lg pb-5"
        //     break;
        // }
        // case "h6": {
        //     elem.attribs.class = "text-base font-extrabold pb-5"
        //     break;
        // }
        // case "ol": {
        //     elem.attribs.class = "list-decimal py-4 px-6";
        //     break;
        // }
        // case "ul": {
        //     elem.attribs.class = "list-disc py-4 px-6";
        //     break;
        // }
    }
    return elem;
});