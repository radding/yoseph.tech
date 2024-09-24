import z from "zod";
import parse, { Element } from 'html-react-parser';

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