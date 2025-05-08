import {LisGraphql, LisGraphqlConstructor} from '../graphql';
import {
  geneSearchFormData,
  geneSearchFunction,
} from './lis-gene-search-element/queries';

/**
 * A mixin that adds Web Component queries to the `LisGraphql` base class.
 * @template TBase - The type of the class that the mixin class will extend.
 * @param {Base} TBase - The class that the mixin class will extend.
 */
export function LisGraphqlWebComponentsMixin<
  TBase extends LisGraphqlConstructor,
>(Base: TBase) {
  return class LisGraphqlWebComponents extends Base {
    // LisGeneSearchElement
    geneSearchFormData = geneSearchFormData;
    geneSearchFormDataFactory = (): typeof geneSearchFormData => {
      return (...args) => this.geneSearchFormData(...args);
    };
    geneSearchFunction = geneSearchFunction;
    geneSearchFunctionFactory = (): typeof geneSearchFunction => {
      return (...args) => this.geneSearchFunction(...args);
    };
  };
}

/**
 * An instance of the Web Component mixin that simply extends the `LisGraphql` base class.
 */
export const LisGraphqlWebComponents = LisGraphqlWebComponentsMixin(LisGraphql);
