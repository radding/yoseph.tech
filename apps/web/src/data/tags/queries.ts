export const specificTagQuery = `
query ($slug:ID!, $cursor:String){
  tag(id: $slug, idType: SLUG) {
    description
    slug
    name
    posts(first: 10, after: $cursor) {
      nodes {
        title
        slug
        excerpt
        date
        categories {
          nodes {
            slug
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`