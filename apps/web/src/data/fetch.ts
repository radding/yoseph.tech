
export const fetchData = async (query: string, variables?: any) => {
    const data = await fetch("https://content-shuttl.herokuapp.com/yoseph-tech/index.php?graphql", {
        method: "POST",
        body: JSON.stringify({ query, variables }),
        headers: {
            "Content-type": "application/json",
        }
    })
    const d = await data.json();
    return d;
}