import {
  LisPangeneLookupData,
  LisPangeneLookupFormData,
  LisPangeneLookupFormDataOptions,
  LisPangeneLookupOptions,
  LisPangeneLookupResults,
} from '@legumeinfo/web-components';
import {LisGraphql, LisGraphqlResponse} from '../../graphql';
import {downloadFile, nextBin} from '../utils';
import {PangeneLookupMiddleware} from './middleware';

/** The GraphQL query used to get chromosomes for the pangene lookup form. */
const getChromosomesQuery = `
  query FormDataQuery {
    chromosomes {
      results {
        annotationVersion
        assemblyVersion
        strain {
          organism {
            genus
            species
          }
          identifier
        }
      }
    }
  }
`;

/** The structure of the data returned by `getChromosomesQuery`. */
type GetChromosomesData = {
  chromosomes: {
    results: [
      {
        annotationVersion: string;
        assemblyVersion: string;
        strain: {
          organism: {
            genus: string;
            species: string;
          };
          identifier: string;
        };
      },
    ];
  };
};

/**
 * Shims GraphQL `GetChromosomesData` into `LisPangeneLookupFormData`.
 * @param {GetChromosomesData} data - The data portional of the `LisGraphqlResponse` for the `getChromosomesQuery`.
 * @returns {LisPangeneLookupFormData} The data to be used by the `LisPaneneLookupElement` Web Component.
 */
function chromosomesDataToFormData(
  data: GetChromosomesData,
): LisPangeneLookupFormData {
  type Annotations = Set<string>;
  type AssemblyBin = {[key: string]: Annotations};
  type StrainBin = {[key: string]: AssemblyBin};
  type SpeciesBin = {[key: string]: StrainBin};
  type GenusBin = {[key: string]: SpeciesBin};
  type Bin = Annotations | AssemblyBin | StrainBin | SpeciesBin | GenusBin;

  // bin the strains by genus then species, etc
  const binnedFormData: GenusBin = {};
  data.chromosomes.results.forEach(
    ({
      annotationVersion,
      assemblyVersion,
      strain: {
        organism: {genus, species},
        identifier,
      },
    }) => {
      let bin: Bin = binnedFormData;
      bin = nextBin(bin, genus, {});
      bin = nextBin(bin, species, {});
      bin = nextBin(bin, identifier, {});
      bin = nextBin(bin, assemblyVersion, new Set<string>());
      if (annotationVersion != null) {
        bin.add(annotationVersion);
      }
    },
  );

  // collapse the bins into arrays of objects
  const genuses = Object.entries(binnedFormData).map(
    ([genus, binnedSpecies]) => {
      const species = Object.entries(binnedSpecies).map(
        ([species, binnedStrains]) => {
          const strains = Object.entries(binnedStrains).map(
            ([strain, binnedAssemblies]) => {
              const assemblies = Object.entries(binnedAssemblies).map(
                ([assembly, annotations]) => {
                  return {
                    assembly,
                    annotations: [...annotations].map((annotation) => ({
                      annotation,
                    })),
                  };
                },
              );
              return {strain, assemblies};
            },
          );
          return {species, strains};
        },
      );
      return {genus, species};
    },
  );

  // return the expected form data object
  return {genuses};
}

/**
 * Queries the GraphQL server for form data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LisPangeneLookupFormDataOptions} options - `LisPangeneLookupFormDataFunction` options.
 * @returns {Promise<LisPangeneLookpuFormData>} A `Promise` that resolves to `LisPangeneLookupFormData`.
 */
export function formDataFunction(
  options: LisPangeneLookupFormDataOptions = {},
): Promise<LisPangeneLookupFormData> {
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetOrganismsData>(
    getChromosomesQuery,
    {},
    abortSignal,
  ).then(({data}: LisGraphqlResponse<GetChromosomesData>) =>
    chromosomesDataToFormData(data),
  );
}

/** The GraphQL query used to get pangene sets for the pangene lookup Web Component. */
const getGenePangeneSetsQuery = `
  query PangenesetsQuery($identifiers: [ID!]!) {
    getGenes(identifiers: $identifiers) {
      results {
        identifier
        panGeneSets {
          identifier
        }
      }
    }
  }
`;

/** The structure of the data returned by `getGenePangeneSetsQuery`. */
type GetGenePangeneSetsData = {
  getGenes: {
    results: [
      {
        identifier: string;
        panGeneSets: [
          {
            identifier: string;
          },
        ];
      },
    ];
  };
};

/** The GraphQL query used to pan genes for the pangene lookup Web Component. */
const getPangenePairsQuery = `
  query PangenesQuery($identifiers: [ID!]!, $genus: String, $species: String, $strain: String, $assembly: String, $annotation: String, $page: Int, $pageSize: Int) {
    panGenePairs(identifiers: $identifiers, genus: $genus, species: $species, strain: $strain, assembly: $assembly, annotation: $annotation, page: $page, pageSize: $pageSize) {
      results {
        query {
          identifier
        }
        panGeneSet {
          identifier
        }
        result {
          identifier
        }
      }
      resultsInfo {
        identifierCounts {
          identifier
          count
        }
      }
      pageInfo {
        hasNextPage
        numResults
        pageSize
        pageCount
      }
    }
  }
`;

/** The structure of the data returned by `getPangenePairsQuery`. */
type GetPangenePairsData = {
  panGenePairs: {
    results: [
      {
        query: {
          identifier: string;
        };
        panGeneSet: {
          identifier: string;
        };
        result: {
          identifier: string;
        };
      },
    ];
    resultsInfo: {
      identifierCounts: [
        {
          identifier: string;
          count: number;
        },
      ];
    };
    pageInfo: {
      hasNextPage: boolean;
      numResults: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

/**
 * Shims GraphQL `PangenesResults` into the `PaginatedSearchResults<PangeneLookupResult[]>`.
 * @param {string[]} identifiers - The list of identifiers used in the .
 * @param {GetGenePangeneSetsData} geneData - The data portional of the `LisGraphqlResponse` for the `getGenePangeneSetsQuery`.
 * @param {GetPangenePairsData} pairData - The data portional of the `LisGraphqlResponse` for the `getPangenePairsQuery`.
 * @returns {LisPangeneLookupResults} The data to be used by the `LisPaneneLookupElement` Web Component.
 */
function pangenesDataToLookupResults(
  identifiers: string[],
  geneData: GetGenePangeneSetsData,
  pairData: GetPangenePairsData,
): LisPangeneLookupResults {
  const {
    getGenes: {results: setResults},
  } = geneData;
  const {
    panGenePairs: {results: geneResults, resultsInfo, pageInfo},
  } = pairData;

  // convert the result genes into the expected format
  const results = geneResults.map(
    ({query: {identifier: input}, panGeneSet: set, result}) => {
      let panGeneSet = '';
      let target = '';
      if (set != null) {
        panGeneSet = set.identifier;
        if (result != null) {
          target = result.identifier;
        }
      }
      return {input, panGeneSet, target};
    },
  );

  // check that a gene was found for each query identifier
  const queryGenes = setResults.map(({identifier}) => identifier);
  const identifiersMatched = resultsInfo.identifierCounts
    .filter(({count}) => count > 0)
    .map(({identifier}) => identifier);
  const errors = identifiers.reduce(
    (accumulator: string[], identifier: string) => {
      const i = queryGenes.indexOf(identifier);
      if (i === -1) {
        accumulator.push(`"${identifier}" is not a valid gene identifier`);
      } else if (!setResults[i].panGeneSets.length) {
        accumulator.push(`"${identifier}" does not belong to a pangene set`);
      } else if (identifiersMatched.indexOf(identifier) == -1) {
        accumulator.push(
          `No matching targets found in a pangene set for "${identifier}"`,
        );
      }
      return accumulator;
    },
    [],
  );

  // extract the page info
  const {
    hasNextPage: hasNext,
    numResults,
    pageSize,
    pageCount: numPages,
  } = pageInfo;

  // construct the expected search results object
  return {
    results,
    errors,
    hasNext,
    numResults,
    pageSize,
    numPages,
  };
}

/**
 * Queries the GraphQL server for pangene data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LisPangeneLookupData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisPangeneLookupOptions} options - `LisPangeneLookupFunction` options.
 * @returns {Promise<LisPangeneLookupResults>} A `Promise` that resolves to `LisPangeneLookupResults`.
 */
export function searchFunction(
  queryData: LisPangeneLookupData,
  options: LisPangeneLookupOptions = {},
): Promise<LisPangeneLookupResults> {
  const {
    genus,
    species,
    strain,
    assembly,
    annotation,
    genes: identifiers,
    page,
  } = queryData;
  const variables = {
    identifiers,
    genus,
    species,
    strain,
    assembly,
    annotation,
    page,
    pageSize: 10,
  };
  const {abortSignal} = options;

  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  const pangenesetQuery = this.request<GetGenePangeneSetsData>(
    getGenePangeneSetsQuery,
    {identifiers},
    abortSignal,
  );
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  const pangeneQuery = this.request<GetPangenePairsData>(
    getPangenePairsQuery,
    variables,
    abortSignal,
  );

  // shim the results
  return Promise.all([pangenesetQuery, pangeneQuery]).then(
    ([{data: geneData}, {data: pairData}]) =>
      pangenesDataToLookupResults(identifiers, geneData, pairData),
  );
}

/**
 * Queries the GraphQL server for pangene data, shims the results, and puts the result into a file for download.
 * @param {LisPangeneLookupData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisPangeneLookupOptions} options - `LisPangeneLookupFunction` options.
 * @returns {Promise<LisPangeneLookupResults>} A `Promise` that resolves to `LisPangeneLookupResults`.
 */
export function downloadFunction(
  queryData: LisPangeneLookupData,
  options: LisPangeneLookupOptions = {},
): Promise<LisPangeneLookupResults> {
  // very similar to searchFunction but page and pageSize are omitted
  const {
    genus,
    species,
    strain,
    assembly,
    annotation,
    genes: identifiers,
  } = queryData;
  const variables = {
    identifiers,
    genus,
    species,
    strain,
    assembly,
    annotation,
  };
  const {abortSignal} = options;

  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  const pangenesetQuery = this.request<GetGenePangeneSetsData>(
    getGenePangeneSetsQuery,
    {identifiers},
    abortSignal,
  );
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  const pangeneQuery = this.request<GetPangenePairsData>(
    getPangenePairsQuery,
    variables,
    abortSignal,
  );

  // shim the results
  const request = Promise.all([pangenesetQuery, pangeneQuery]).then(
    ([{data: geneData}, {data: pairData}]) =>
      pangenesDataToLookupResults(identifiers, geneData, pairData),
  );

  // convert the results into a file and download it
  request.then(({results}) => {
    const filename = 'pangenes.tsv';
    const tsvContent =
      'input\tpanGeneSet\ttarget\n' +
      results
        .map(
          ({input, panGeneSet, target}) => `${input}\t${panGeneSet}\t${target}`,
        )
        .join('\n');
    downloadFile(filename, tsvContent);
  });

  // send the results to the component so it can react
  return request;
}

/** The type of the object returned by `pangeneLookupQueriesFactory`. */
export type PangeneLookupQueries = {
  formDataFunction: typeof formDataFunction;
  formDataFunctionFactory: () => typeof formDataFunction;
  searchFunction: typeof searchFunction;
  searchFunctionFactory: (
    ...args: PangeneLookupMiddleware[]
  ) => typeof searchFunction;
  downloadFunction: typeof downloadFunction;
  downloadFunctionFactory: () => typeof downloadFunction;
};

/** The pangeneLookup portion of `LisGraphqlWebComponentsMixin.queries`. */
export const pangeneLookupQueriesFactory = <T extends LisGraphql>(
  context: T,
) => {
  return {
    formDataFunction: formDataFunction.bind(context),
    formDataFunctionFactory: function (): typeof formDataFunction {
      return (...args) => this.formDataFunction(...args);
    },
    searchFunction: searchFunction.bind(context),
    searchFunctionFactory: function (
      ...middleware: PangeneLookupMiddleware[]
    ): typeof searchFunction {
      return (...args) => {
        let promise = this.searchFunction(...args);
        middleware.forEach((m) => {
          promise = promise.then(m);
        });
        return promise;
      };
    },
    downloadFunction: downloadFunction.bind(context),
    downloadFunctionFactory: function (): typeof downloadFunction {
      return (...args) => this.downloadFunction(...args);
    },
  };
};
