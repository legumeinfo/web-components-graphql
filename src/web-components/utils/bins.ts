/** A generic bin type. */
export type Bin<T> = {[key: string]: T};

/**
 * Used to descend nested bins; given a key, sets the default value for the key if it's not present, and then returns the value for the key.
 * @template T - The type stored in the bin.
 * @param {Bin<T>} bin - The current bin.
 * @param {string} key - The key whose value should be returned (and possibly set the default value in the current bin).
 * @param {T} defaultValue - The default value to assign the key in the current bin if the key is not present.
 * @returns {T} The value for the key in the current bin.
 */
export function nextBin<T>(bin: Bin<T>, key: string, defaultValue: T): T {
  if (!(key in bin)) {
    bin[key] = defaultValue;
  }
  return bin[key];
}
