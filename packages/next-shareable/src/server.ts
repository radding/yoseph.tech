import { AsyncLocalStorage } from "async_hooks";
import "server-only";

let storage = new AsyncLocalStorage();

type Wrapper = <TArgs extends Array<any>, TReturn>(fn: (...args: TArgs) => TReturn) => (...args: TArgs) => TReturn;

export const CreateShareable = <TArgs extends Array<any>, TReturn>(factory: (...args: TArgs) => Promise<TReturn>): [Wrapper, <TSelectorReturn>(selector: (state: TReturn) => TSelectorReturn) => TSelectorReturn | undefined] => {
    return [(fn) => (...args) => {
        // @ts-expect-error
        return storage.run(factory(...args), () => fn(...args));

    }, <TSelectorReturn>(selector: (state: TReturn) => TSelectorReturn) => {
        const store = storage.getStore() as TReturn;
        if (!store) {
            return;
        }
        return selector(store);
    }]
}
