import {LisGraphql, LisGraphqlConstructor} from '../graphql';

/**
 * A mixin that adds Web Component queries to the `LisGraphql` base class.
 * @template TBase - The type of the class that the mixin class will extend.
 * @param {Base} TBase - The class that the mixin class will extend.
 */
export function LisGraphqlWebComponentsMixin<
  TBase extends LisGraphqlConstructor,
>(Base: TBase) {
  return class LisGraphqlWebComponents extends Base {};
}

/**
 * An instance of the Web Component mixin that simply extends the `LisGraphql` base class.
 */
export const LisGraphqlWebComponents = LisGraphqlWebComponentsMixin(LisGraphql);
