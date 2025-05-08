import {
  LisGeneSearchData,
  LisGeneSearchFormData,
  LisGeneSearchFormDataOptions,
  LisGeneSearchOptions,
  LisGeneSearchResults,
} from '@legumeinfo/web-components';
import {GraphqlResponse} from '../../graphql';

/** The GraphQL query used to get organisms for the search form. */
const getOrganismsQuery = `
  query OrganismsQuery {
    organisms {
      results {
        genus
        species
        strains {
          identifier
        }
      }
    }
  }
  `;

/** The structure of the data returned by `getOrganismsQuery`. */
type GetOrganismsData = {
  organisms: {
    results: [
      {
        genus: string;
        species: string;
        strains: [
          {
            identifier: string;
          },
        ];
      },
    ];
  };
};

/**
 * Shims GraphQL `GetOrganismsData` into `LisGeneSearchFormData`.
 * @param {GetOrganismsData} data - The data portion of the `GraphqlResponse` for the `getOrganismsQuery`.
 * @returns {LisGeneSearchFormData} The data to be used by the `LisGeneSearchElement` Web Component.
 */
function organismsDataToFormData(
  data: GetOrganismsData,
): LisGeneSearchFormData {
  type Strain = {identifier: string};
  type SpeciesBin = {[key: string]: Strain[]};
  type GenusBin = {[key: string]: SpeciesBin};

  // bin the strains by genus then species
  const binnedFormData: GenusBin = {};
  data.organisms.results.forEach(({genus, species, strains}) => {
    if (!(genus in binnedFormData)) {
      binnedFormData[genus] = {};
    }
    if (!(species in binnedFormData[genus])) {
      binnedFormData[genus][species] = [];
    }
    binnedFormData[genus][species].push(...strains);
  });

  // collapse the bins into arrays of objects
  const genuses = Object.entries(binnedFormData).map(
    ([genus, binnedSpecies]) => {
      const species = Object.entries(binnedSpecies).map(
        ([species, strainObjects]) => {
          const strains = strainObjects.map(({identifier}) => {
            return {strain: identifier};
          });
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
 * @param {LisGeneSearchFormDataOptions} options - `LisGeneSearchFormDataFunction` options.
 * @returns {Promise<LisGeneSearchFormData>} A `Promise` that resolves to `LisGeneSearchFormData`.
 */
export function geneSearchFormData(
  options: LisGeneSearchFormDataOptions = {},
): Promise<LisGeneSearchFormData> {
  const {abortSignal} = options;
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<GetOrganismsData>(
    getOrganismsQuery,
    {},
    abortSignal,
  ).then(({data}: GraphqlResponse<GetOrganismsData>) =>
    organismsDataToFormData(data),
  );
}

/** The GraphQL query used to search for genes. */
const searchGenesQuery = `
  query GenesQuery($identifier: String, $name: String, $description: String, $genus: String, $species: String, $strain: String, $family: String, $page: Int, $pageSize: Int) {
    genes(genus: $genus, species: $species, strain: $strain, identifier: $identifier, name: $name, description: $description, geneFamilyIdentifier: $family, page: $page, pageSize: $pageSize) {
      results {
        name
        identifier
        description
        organism { genus species }
        strain { identifier }
        geneFamilyAssignments { geneFamily { identifier } }
        panGeneSets { identifier }
        locations { chromosome { identifier } supercontig { identifier } start end strand }
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

/** The structure of the data returned by `getOrganismsQuery`. */
type SearchGenesData = {
  genes: {
    results: [
      {
        name: string;
        identifier: string;
        description: string;
        organism: {
          genus: string;
          species: string;
        };
        strain: {
          identifier: string;
        };
        geneFamilyAssignments: {
          geneFamily: {
            identifier: string;
          };
        }[];
        panGeneSets: {
          identifier: string;
        }[];
        locations: {
          chromosome: {
            identifier: string;
          };
          supercontig: {
            identifier: string;
          };
          start: number;
          end: number;
          strand: string;
        }[];
      },
    ];
    pageInfo: {
      hasNextPage: boolean;
      numResults: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

/**
 * Shims GraphQL `SearchGenesData` into `LisGeneSearchResults`.
 * @param {SearchGenesData} data - The data portional of the `GraphqlResponse` for the `searchGenesQuery`.
 * @returns {LisGeneSearchResults} The data to be used by the `LisGeneSearchElement` Web Component.
 */
function genesDataToSearchResults(data: SearchGenesData): LisGeneSearchResults {
  // extract the page info
  const {
    hasNextPage: hasNext,
    numResults,
    pageSize,
    pageCount: numPages,
  } = data.genes.pageInfo;

  // flatten results
  const results = data.genes.results.map(
    ({organism: {genus, species}, strain, ...gene}) => {
      const geneFamilyAssignments = gene.geneFamilyAssignments.map(
        ({geneFamily: {identifier}}) => identifier,
      );
      const panGeneSets = gene.panGeneSets.map(({identifier}) => identifier);
      const locations = gene.locations.map(
        ({chromosome, supercontig, start, end, strand}) => {
          const interval = `${start}-${end} (${strand})`;
          if (chromosome?.identifier) {
            return `${chromosome?.identifier}:${interval} (chromosome)`;
          } else if (supercontig?.identifier) {
            return `${supercontig?.identifier}:${interval} (supercontig)`;
          }
          return `unknown:${interval}`;
        },
      );
      return {
        genus,
        species,
        strain: strain.identifier,
        ...gene,
        geneFamilyAssignments,
        panGeneSets,
        locations,
      };
    },
  );

  // return the expected paginated results object
  return {hasNext, numResults, pageSize, numPages, results};
}

/**
 * Queries the GraphQL server for gene data and shims the result into Web Component data.
 * This function should only be used as a method of `LisGraphqlWebComponentsMixin`.
 * @param {LisGeneSearchData} queryData - The data from which GraphQL query variables will be derived.
 * @param {LisGeneSearchOptions} options - `LisGeneSearchFunction` options.
 * @returns {Promise<LisGeneSearchResults>} A `Promise` that resolves to `LisGeneSearchResults`.
 */
export function geneSearchFunction(
  queryData: LisGeneSearchData,
  options: LisGeneSearchOptions = {},
): Promise<LisGeneSearchResults> {
  const {abortSignal} = options;
  const variables = {...queryData, pageSize: 10};
  // @ts-expect-error 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.request<SearchGenesData>(
    searchGenesQuery,
    variables,
    abortSignal,
  ).then(({data}: GraphqlResponse<SearchGenesData>) =>
    genesDataToSearchResults(data),
  );
}
