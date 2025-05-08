import {LisGraphql, LisGraphqlConstructor} from '../graphql';
import {
  geneSearchFormData,
  geneSearchFunction,
} from './lis-gene-search-element/queries';
import {
  linkoutFunction,
  linkoutFunctionGene,
  linkoutFunctionGeneFamily,
  linkoutFunctionGwas,
  linkoutFunctionLocation,
  linkoutFunctionPanGeneSet,
  linkoutFunctionQtlStudy,
} from './lis-linkout-element';

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

    // LisLinkoutElement
    linkoutFunction = linkoutFunction;
    linkoutFunctionFactory = (): typeof linkoutFunction => {
      return (...args) => this.linkoutFunction(...args);
    };
    linkoutFunctionGene = linkoutFunctionGene;
    linkoutFunctionGeneFactory = (): typeof linkoutFunctionGene => {
      return (...args) => this.linkoutFunctionGene(...args);
    };
    linkoutFunctionGeneFamily = linkoutFunctionGeneFamily;
    linkoutFunctionGeneFamilyFactory = (): typeof linkoutFunctionGeneFamily => {
      return (...args) => this.linkoutFunctionGeneFamily(...args);
    };
    linkoutFunctionGwas = linkoutFunctionGwas;
    linkoutFunctionGwasFactory = (): typeof linkoutFunctionGwas => {
      return (...args) => this.linkoutFunctionGwas(...args);
    };
    linkoutFunctionLocation = linkoutFunctionLocation;
    linkoutFunctionLocationFactory = (): typeof linkoutFunctionLocation => {
      return (...args) => this.linkoutFunctionLocation(...args);
    };
    linkoutFunctionPanGeneSet = linkoutFunctionPanGeneSet;
    linkoutFunctionPanGeneSetFactory = (): typeof linkoutFunctionPanGeneSet => {
      return (...args) => this.linkoutFunctionPanGeneSet(...args);
    };
    linkoutFunctionQtlStudy = linkoutFunctionQtlStudy;
    linkoutFunctionQtlStudyFactory = (): typeof linkoutFunctionQtlStudy => {
      return (...args) => this.linkoutFunctionQtlStudy(...args);
    };
  };
}

/**
 * An instance of the Web Component mixin that simply extends the `LisGraphql` base class.
 */
export const LisGraphqlWebComponents = LisGraphqlWebComponentsMixin(LisGraphql);
