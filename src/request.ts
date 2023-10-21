type ApiResult = {
  data: {
    search: {
      edges: any[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: string
        totalCount: number
      }
    }
  }
}

export class GraphQLFetcher {
  private static instance: GraphQLFetcher | null = null
  private apiUrl: string
  private authToken: string

  constructor(apiUrl: string, authToken: string) {
    this.apiUrl = apiUrl
    this.authToken = authToken
  }

  static getInstance(apiUrl: string, authToken: string): GraphQLFetcher {
    if (!this.instance) {
      this.instance = new GraphQLFetcher(apiUrl, authToken)
    }
    return this.instance
  }

  /**
   * Requests data from the server.
   *
   * @param {string | undefined} cursor - The cursor for pagination.
   * @param {number} limit - The maximum number of items to return.
   * @param {string} searchQuery - The search query.
   * @return {Promise<any>} A promise that resolves to the response from the server.
   */
  async request(
    cursor: string | undefined,
    limit: number,
    searchQuery: string
  ): Promise<ApiResult> {
    const query = `
    query Search(
      $after: String
      $first: Int
      $query: String
      $includeContent: Boolean
      $format: String
    ) {
      search(
        after: $after
        first: $first
        query: $query
        includeContent: $includeContent
        format: $format
      ) {
        ... on SearchSuccess {
          edges {
            node {
              id
              title
              slug
              content
              url
              createdAt
              image
              author
            }
          }
          pageInfo {
            hasNextPage
            endCursor
            totalCount
          }
        }
        ... on SearchError {
          errorCodes
        }
      }
    }
  `

    const variables = {
      after: cursor,
      first: limit,
      format: "html",
      includeContent: true,
      query: searchQuery,
    }

    const headers = {
      Cookie: `auth=${this.authToken};`,
      "Content-Type": "application/json",
    }

    const params = {
      variables,
      query,
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    })

    return await response.json()
  }
}
