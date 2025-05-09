/** The type of response returned by all GraphQL requests. */
export type LisGraphqlResponse<T> = {
  data: T;
  errors?: string[];
};

/**
 * Gets data from a GraphQL server via a POST request.
 * Adapted from https://graphql.org/graphql-js/graphql-clients/
 * @template T - The type of the data returned by the query's response.
 * @param {string} uri - The uri of the GraphQL server to send the query to.
 * @param {string} query - The GraphQL query.
 * @param {object} variables - The variables for the query.
 * @param {abortSignal} AbortSignal - An AbortSignal object that can cancel the request.
 * @returns {Promise<LisGraphqlResponse<T>>} A `Promise` that resolves to a `LisGraphqlResponse` object.
 */
export function lisGraphqlQuery<T>(
  uri: string,
  query: string,
  variables: object = {},
  abortSignal?: AbortSignal,
): Promise<LisGraphqlResponse<T>> {
  return fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    signal: abortSignal,
  })
    .then((r) => r.json())
    .then((response) => {
      if (response.errors) {
        response.errors.forEach(console.error);
      }
      if (response.data === null) {
        throw new Error('no data returned');
      }
      return response;
    });
}

/** A base class for sending GraphQL requests. */
export class LisGraphql {
  public uri;

  /**
   * @param {string} uri - The uri of the GraphQL server to send queries to.
   */
  constructor(uri: string) {
    this.uri = uri;
  }

  /**
   * Gets data from the GraphQL server at the class's uri.
   * @template T - The type of the data returned by the query's response.
   * @param {string} query - The GraphQL query.
   * @param {object} variables - The variables for the query.
   * @param {abortSignal} AbortSignal - An AbortSignal object that can cancel the request.
   * @returns {Promise<LisGraphqlResponse<T>>} A `Promise` that resolves to a `LisGraphqlResponse` object.
   */
  public request<T>(
    query: string,
    variables: object = {},
    abortSignal?: AbortSignal,
  ): Promise<LisGraphqlResponse<T>> {
    return lisGraphqlQuery(this.uri, query, variables, abortSignal);
  }
}

/**
 * A constructor that allows the creation of mixins that must have `LisGraphql`
 * as the base class.
 */
export type LisGraphqlConstructor = new (...args: any[]) => LisGraphql;
