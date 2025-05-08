import {modalLink} from '../lis-modal-element';
import {LisGeneSearchResults} from '@legumeinfo/web-components';

/** The signature of a middleware function for the `LisGeneSearchElement` component. */
export type GeneSearchMiddleware = (
  results: LisGeneSearchResults,
) => LisGeneSearchResults;

/**
 * Creates a middleware function that can be used with the `geneSearchFunctionFactory` function
 * to convert `identifiers` in `LisGeneSearchResults` into links that open a modal with the given
 * `modalId`.
 * @param {string} modalId - The HTML `id` of the target modal element.
 * @returns {GeneSearchMiddleware} The created middleware function.
 */
export function geneIdentifierModalLinkFactory(
  modalId: string,
): GeneSearchMiddleware {
  return ({results: oldResults, ...pageInfo}) => {
    const results = oldResults.map(({identifier, ...geneInfo}) => {
      const data = {identifier, type: 'gene'};
      return {
        ...geneInfo,
        identifier: modalLink(modalId, identifier, data),
      };
    });
    return {...pageInfo, results};
  };
}

/**
 * Creates a middleware function that can be used with the `geneSearchFunctionFactory` function
 * to convert `locations` in `LisGeneSearchResults` into links that open a modal with the given
 * `modalId`.
 * @param {string} modalId - The HTML `id` of the target modal element.
 * @returns {GeneSearchMiddleware} The created middleware function.
 */
export function locationModalLinkFactory(
  modalId: string,
): GeneSearchMiddleware {
  return ({results: oldResults, ...pageInfo}) => {
    const results = oldResults.map(({locations: oldLocations, ...geneInfo}) => {
      const locations = oldLocations.map((location) => {
        // extract the data from the location string made by genesDataToSearchResults
        const re = /(?<identifier>.+):(?<start>\d+)-(?<end>\d+)/;
        const data = location.match(re)?.groups;
        // NOTE: block will not execute unless shim is out of sync with regexp
        if (data === undefined) {
          return location;
        }
        data.type = 'location';
        return modalLink(modalId, location, data);
      });
      return {...geneInfo, locations};
    });
    return {...pageInfo, results};
  };
}

/**
 * Creates a middleware function that can be used with the `geneSearchFunctionFactory` function
 * to convert `geneFamilyAssignments` in `LisGeneSearchResults` into links that open a modal with
 * the given `modalId`.
 * @param {string} modalId - The HTML `id` of the target modal element.
 * @returns {GeneSearchMiddleware} The created middleware function.
 */
export function geneFamilyAssignmentsModalLinkFactory(
  modalId: string,
): GeneSearchMiddleware {
  return ({results: oldResults, ...pageInfo}) => {
    const results = oldResults.map(
      ({geneFamilyAssignments: oldGeneFamilyAssignments, ...geneInfo}) => {
        const geneFamilyAssignments = oldGeneFamilyAssignments.map(
          (identifier) => {
            const data = {identifier, type: 'geneFamily'};
            return modalLink(modalId, identifier, data);
          },
        );
        return {
          ...geneInfo,
          geneFamilyAssignments,
        };
      },
    );
    return {...pageInfo, results};
  };
}

/**
 * Creates a middleware function that can be used with the `geneSearchFunctionFactory` function
 * to convert `panGeneSets` in `LisGeneSearchResults` into links that open a modal with the given
 * `modalId`.
 * @param {string} modalId - The HTML `id` of the target modal element.
 * @returns {GeneSearchMiddleware} The created middleware function.
 */
export function panGeneSetsModalLinkFactory(
  modalId: string,
): GeneSearchMiddleware {
  return ({results: oldResults, ...pageInfo}) => {
    const results = oldResults.map(
      ({panGeneSets: oldPanGeneSets, ...geneInfo}) => {
        const panGeneSets = oldPanGeneSets.map((identifier) => {
          const data = {identifier, type: 'panGeneSet'};
          return modalLink(modalId, identifier, data);
        });
        return {
          ...geneInfo,
          panGeneSets,
        };
      },
    );
    return {...pageInfo, results};
  };
}

/**
 * Creates all middleware functions that can be used with the `geneSearchFunctionFactory` function
 * to add modal links to `LisGeneSearchResults`.
 * @param {string} modalId - The HTML `id` of the target modal element.
 * @returns {GeneSearchMiddleware[]} The created middleware functions.
 */
export function allModalLinksFactory(modalId: string): GeneSearchMiddleware[] {
  return [
    geneIdentifierModalLinkFactory(modalId),
    locationModalLinkFactory(modalId),
    geneFamilyAssignmentsModalLinkFactory(modalId),
    panGeneSetsModalLinkFactory(modalId),
  ];
}

/** The geneSearch portion of `LisGraphqlWebComponents.middleware`. */
export const geneSearchMiddleware = {
  geneIdentifierModalLinkFactory,
  geneFamilyAssignmentsModalLinkFactory,
  locationModalLinkFactory,
  panGeneSetsModalLinkFactory,
  allModalLinksFactory,
};
