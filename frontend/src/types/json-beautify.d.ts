declare module 'json-beautify' {
  // A type for the replacer function, similar to what JSON.stringify uses
  type ReplacerFunction = (this: any, key: string, value: any) => any;

  /**
   * Beautifies a JavaScript object into a pretty-printed JSON string.
   * 
   * @param value - The value to be beautified (can be any JSON-compatible value).
   * @param replacer - A function or object that can modify the stringification process.
   * @param space - The number of spaces or string to use for indentation.
   * @param limit - An optional limit on how deep the object should be processed (defaults to no limit).
   * @returns A pretty-printed JSON string.
   */
  export default function beautify(
    value: unknown, // 'unknown' is more strict than 'any'
    replacer: ReplacerFunction | Record<string, unknown> | any[] | null,
    space: number | string,
    limit?: number // Optional parameter for limiting the depth of object processing
  ): string;
}
