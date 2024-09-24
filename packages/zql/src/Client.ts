import z from "zod";

interface ClientProps {
    url: string;
    fetch?: typeof fetch;
}

export interface Operation<TReturn> {
    toGraphqlOperation(): {query: string, variables: any};
    parseResponse(resp: unknown): TReturn;
}

export class Client {
    private readonly url: string;
    private readonly fetch: typeof fetch;

    constructor(opts: ClientProps) {
        this.url = opts.url;
        this.fetch = opts.fetch ?? fetch;
    }

    public async do<TReturn>(op: Operation<TReturn>): Promise<TReturn> {
        const operation = op.toGraphqlOperation();
        const resp = await this.fetch(this.url, {
            method: "POST",
            body: JSON.stringify(operation),
            headers: {
                "content-type": "application/json",
            }
        });
        if (!resp.ok) {
            throw new Error(`failed to call endpoint: ${resp.status}: ${await resp.text()}`);
        }
        return op.parseResponse(await resp.json());
    }
}