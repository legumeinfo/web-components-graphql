import {LisGraphql, LisGraphqlConstructor} from '../graphql';
import {
  GeneSearchQueries,
  geneSearchMiddleware,
  geneSearchQueriesFactory,
} from './lis-gene-search-element';
import {LinkoutQueries, linkoutQueriesFactory} from './lis-linkout-element';

/**
 * A mixin that adds Web Component queries to the `LisGraphql` base class.
 * @template TBase - The type of the class that the mixin class will extend.
 * @param {Base} TBase - The class that the mixin class will extend.
 */
export function LisGraphqlWebComponentsMixin<
  TBase extends LisGraphqlConstructor,
>(Base: TBase) {
  return class extends Base {
    readonly queries: {
      geneSearch: GeneSearchQueries;
      linkout: LinkoutQueries;
    };
    readonly middleware = {
      geneSearch: geneSearchMiddleware,
    };

    constructor(...rest: any[]) {
      super(...rest);
      this.queries = {
        geneSearch: geneSearchQueriesFactory(this),
        linkout: linkoutQueriesFactory(this),
      };
    }
  };
}

/**
 * An instance of the Web Component mixin that simply extends the `LisGraphql` base class.
 */
export const LisGraphqlWebComponents = LisGraphqlWebComponentsMixin(LisGraphql);
