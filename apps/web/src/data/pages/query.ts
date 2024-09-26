export const query = `
query ($uri: String) {
  page: pageBy(uri: $uri) {
    status
    id
    slug
    desiredSlug
		uri
    content
    page_data {
      excerpt
    }
    title
    ancestors {
      nodes {
        slug
      }
    }
    hero {
      title
      content
      buttonGroups {
        text
        content
        link
        linkType
        pagePath: pagepath
        page {
          __typename
          ... on Page {
            slug
          }
          ... on Post {
            slug
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
        taxonomy {
          description
          slug
        }
      }
    }
    page_sections {
      sections {
        title
        byline
        posts {
          post {
            ... on Post {
              title
              slug
              excerpt
              date
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const getAllPostsQuery = `query ($cursor: String) {
  pages(after: $cursor) {
    nodes {
      uri
      id
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

`