import {LisLinkoutOptions, LisLinkoutResults} from '@legumeinfo/web-components';
import {GraphqlResponse} from '../../graphql';

/** The GraphQL linkout results type returned for all linkout queries. */
type LinkoutDataResults = [
  {
    href: string;
    text: string;
  },
];

/** The GraphQL query used to get linkouts for genes. */
const getGeneLinkoutsQuery = `
  query GeneLinkoutsQuery($identifier: ID!) {
    geneLinkouts(identifier: $identifier) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getGeneLinkoutsQuery`. */
type GetGeneLinkoutsData = {
  geneLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetGeneLinkoutsData` into `LisLinkoutResults`.
 * @param {GetGeneLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getGeneLinkoutsQuery.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function geneLinkoutsToLinkoutResults(
  data: GetGeneLinkoutsData,
): LisLinkoutResults {
  const results = data.geneLinkouts.results;
  return {results};
}

/** The type of data used for a gene linkout query, */
export type LinkoutGeneData = {identifier: string};

/**
 * Queries the GraphQL server for gene linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutGeneData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionGene(
  queryData: LinkoutGeneData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier} = queryData;
  const variables = {identifier};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetGeneLinkoutsData>(
    getGeneLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetGeneLinkoutsData>) =>
    geneLinkoutsToLinkoutResults(data),
  );
}

/** The GraphQL query used to get linkouts for locations. */
const getLocationLinkoutsQuery = `
  query LocationLinkoutsQuery($identifier: ID!, $start: Int!, $end: Int!) {
    locationLinkouts(identifier: $identifier, start: $start, end: $end) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getLocationLinkoutsQuery`. */
type GetLocationLinkoutsData = {
  locationLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetLocationLinkoutsData` into `LisLinkoutResults`.
 * @param {GetLocationLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getLocationLinkoutsQuery`.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function locationLinkoutsToLinkoutResults(
  data: GetLocationLinkoutsData,
): LisLinkoutResults {
  const results = data.locationLinkouts.results;
  return {results};
}

/** The type of data used for a location linkout query, */
export type LinkoutLocationData = {
  identifier: string;
  start: string;
  end: string;
};

/**
 * Queries the GraphQL server for location linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutLocationData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionLocation(
  queryData: LinkoutLocationData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier, start, end} = queryData;
  const variables = {identifier, start: parseInt(start), end: parseInt(end)};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetLocationLinkoutsData>(
    getLocationLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetLocationLinkoutsData>) =>
    locationLinkoutsToLinkoutResults(data),
  );
}

/** The GraphQL query used to get linkouts for gene families. */
const getGeneFamilyLinkoutsQuery = `
  query GeneFamilyLinkoutsQuery($identifier: ID!) {
    geneFamilyLinkouts(identifier: $identifier) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getGeneFamilyLinkoutsQuery`. */
type GetGeneFamilyLinkoutsData = {
  geneFamilyLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetGeneFamilyLinkoutsData` into `LisLinkoutResults`.
 * @param {GetGeneFamilyLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getGeneFamilyLinkoutsQuery`.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function geneFamilyLinkoutsToLinkoutResults(
  data: GetGeneFamilyLinkoutsData,
): LisLinkoutResults {
  const results = data.geneFamilyLinkouts.results;
  return {results};
}

/** The type of data used for a gene family linkout query, */
export type LinkoutGeneFamilyData = {identifier: string};

/**
 * Queries the GraphQL server for gene family linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutGeneFamilyData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionGeneFamily(
  queryData: LinkoutGeneFamilyData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier} = queryData;
  const variables = {identifier};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetGeneFamilyLinkoutsData>(
    getGeneFamilyLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetGeneFamilyLinkoutsData>) =>
    geneFamilyLinkoutsToLinkoutResults(data),
  );
}

/** The GraphQL query used to get linkouts for pangene sets. */
const getPanGeneSetLinkoutsQuery = `
  query PanGeneSetLinkoutsQuery($identifier: ID!) {
    panGeneSetLinkouts(identifier: $identifier) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getPanGeneSetLinkoutsQuery`. */
type GetPanGeneSetLinkoutsData = {
  panGeneSetLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetPanGeneSetLinkoutsData` into `LisLinkoutResults`.
 * @param {GetPanGeneSetLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getPanGeneSetLinkoutsQuery`.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function panGeneSetLinkoutsToLinkoutResults(
  data: GetPanGeneSetLinkoutsData,
): LisLinkoutResults {
  const results = data.panGeneSetLinkouts.results;
  return {results};
}

/** The type of data used for a pan-gene set linkout query, */
export type LinkoutPanGeneSetData = {identifier: string};

/**
 * Queries the GraphQL server for pan-gene set linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutPanGeneSetData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionPanGeneSet(
  queryData: LinkoutPanGeneSetData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier} = queryData;
  const variables = {identifier};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetPanGeneSetLinkoutsData>(
    getPanGeneSetLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetPanGeneSetLinkoutsData>) =>
    panGeneSetLinkoutsToLinkoutResults(data),
  );
}

/** The GraphQL query used to get linkouts for GWAS. */
const getGwasLinkoutsQuery = `
  query gwasLinkoutsQuery($identifier: ID!) {
    gwasLinkouts(identifier: $identifier) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getGwasLinkoutsQuery`. */
type GetGwasLinkoutsData = {
  gwasLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetGwasLinkoutsData` into `LisLinkoutResults`.
 * @param {GetGwasLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getGwasLinkoutsQuery`.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function gwasLinkoutsToLinkoutResults(
  data: GetGwasLinkoutsData,
): LisLinkoutResults {
  const results = data.gwasLinkouts.results;
  return {results};
}

/** The type of data used for a GWAS linkout query, */
export type LinkoutGwasData = {identifier: string};

/**
 * Queries the GraphQL server for GWAS linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutGwasData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionGwas(
  queryData: LinkoutGwasData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier} = queryData;
  const variables = {identifier};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetGwasLinkoutsData>(
    getGwasLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetGwasLinkoutsData>) =>
    gwasLinkoutsToLinkoutResults(data),
  );
}

/** The GraphQL query used to get linkouts for QTL studies. */
const getQtlStudyLinkoutsQuery = `
  query qtlStudyLinkoutsQuery($identifier: ID!) {
    qtlStudyLinkouts(identifier: $identifier) {
      results {
        href
        text
      }
    }
  }
`;

/** The structure of the data returned by `getQtlStudyLinkoutsQuery`. */
type GetQtlStudyLinkoutsData = {
  qtlStudyLinkouts: {
    results: LinkoutDataResults;
  };
};

/**
 * Shims GraphQL `GetQtlStudyLinkoutsData` into `LisLinkoutResults`.
 * @param {GetQtlStudyLinkoutsData} data - The data portional of the `GraphqlResponse` for the `getQtlStudyLinkoutsQuery`.
 * @returns {LisLinkoutResults} The data to be used by the `LisLinkoutElement` Web Component.
 */
function qtlStudyLinkoutsToLinkoutResults(
  data: GetQtlStudyLinkoutsData,
): LisLinkoutResults {
  const results = data.qtlStudyLinkouts.results;
  return {results};
}

/** The type of data used for a QTL study linkout query, */
export type LinkoutQtlStudyData = {identifier: string};

/**
 * Queries the GraphQL server for QTL study linkout data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LinkoutQtlStudyData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunctionQtlStudy(
  queryData: LinkoutQtlStudyData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  const {identifier} = queryData;
  const variables = {identifier};
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetQtlStudyLinkoutsData>(
    getQtlStudyLinkoutsQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<GetQtlStudyLinkoutsData>) =>
    qtlStudyLinkoutsToLinkoutResults(data),
  );
}

/** The type of data used for a general linkout query, */
export type LinkoutData =
  | {type: 'gene'; linkoutData: LinkoutGeneData}
  | {type: 'location'; linkoutData: LinkoutLocationData}
  | {type: 'geneFamily'; linkoutData: LinkoutGeneFamilyData}
  | {type: 'panGeneSet'; linkoutData: LinkoutPanGeneSetData}
  | {type: 'gwas'; linkoutData: LinkoutGwasData}
  | {type: 'qtlStudy'; linkoutData: LinkoutQtlStudyData};

/**
 * A linkouts function to use for the `linkoutFunction` property of the `LisLinkoutElement` Web
 * Component that supports all linkout types.
 * @param {LinkoutData} {type, linkoutData} - An object containing the linkout type and the data needed to get linkouts for that type.
 * @param {LisLinkoutOptions} options - `LisLinkoutFunction` options.
 * @returns {Promise<LisLinkoutResults>} A `Promise` that resolves to `LisLinkoutResults`.
 */
export function linkoutFunction(
  {type, linkoutData}: LinkoutData,
  options: LisLinkoutOptions = {},
): Promise<LisLinkoutResults> {
  switch (type) {
    case 'gene':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionGene(linkoutData, options);
    case 'location':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionLocation(linkoutData, options);
    case 'geneFamily':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionGeneFamily(linkoutData, options);
    case 'panGeneSet':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionPanGeneSet(linkoutData, options);
    case 'gwas':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionGwas(linkoutData, options);
    case 'qtlStudy':
      // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
      return this.linkoutFunctionQtlStudy(linkoutData, options);
  }
  return Promise.reject();
}
