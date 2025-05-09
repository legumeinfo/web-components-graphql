import {LisPangeneLookupResults} from '@legumeinfo/web-components';

/** The signature of a middleware function for the `LisPangeneLookupElement` component. */
export type PangeneLookupMiddleware = (
  results: LisPangeneLookupResults,
) => LisPangeneLookupResults;
