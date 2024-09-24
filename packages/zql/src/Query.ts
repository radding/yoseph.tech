import z from "zod";
import { inspect } from "util";

import { Operation } from "./Client";

export class Query<TZod extends z.ZodType, TReturn extends z.infer<TZod>> implements Operation<TReturn> {
    private variables: Record<string, any> = {};

    constructor(private readonly query: TZod) {

    }

    public withVariables(v: Record<string, any>): Query<TZod, TReturn> {
        this.variables = {
            ...this.variables,
            ...v,
        }
        return this;
    }

    toGraphqlOperation(): { query: string; variables: any; } {
        console.log(inspect(this.query._def))
        throw new Error("Method not implemented.");
    }
    parseResponse(resp: unknown): TReturn {
        return this.query.parse(resp);
    }
}
