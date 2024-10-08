export const specificCategoryQuery = `
query ($slug:ID!, $cursor:String){
  category(id: $slug, idType: SLUG) {
    description
    slug
    name
    posts(first: 10, after: $cursor) {
      nodes {
        title
        slug
        excerpt
        rawExcerpt: excerpt
        date
        tags {
          nodes {
            slug
            name
          }
        }
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