/**
 * Cache interface
 * @see https://www.php-fig.org/psr/psr-16/
 */
export interface CacheInterface
{
    /**
     * Fetches a value from the cache.
     *
     * @param {string} key     The unique key of this item in the cache.
     * @param {any} defaultValue Default value to return if the key does not exist.
     * @return {any} The value of the item from the cache, or $default in case of cache miss.
     * @throws
     */
    get(key: string, defaultValue?: any | null): any;

    /**
     * Persists data in the cache, uniquely referenced by a key with an optional expiration TTL time.
     *
     * @param {string} key The key of the item to store.
     * @param {any} defaultValue The value of the item to store. Must be serializable.
     * @param {number|null} ttl Optional. The TTL value of this item. If no value is sent and
     *                                      the driver supports TTL then the library may set a default value
     *                                      for it or let the driver take care of that.
     *
     * @return {boolean} True on success and false on failure.
     * @throws
     */
    set(key: string, value: any, ttl?: number | null): boolean;

    /**
     * Delete an item from the cache by its unique key.
     *
     * @param {string} key The unique cache key of the item to delete.
     * @return {boolean} True if the item was successfully removed. False if there was an error.
     * @throws
     */
    delete(key: string): boolean;

    /**
     * Wipes clean the entire cache's keys.
     *
     * @return {boolean} True on success and false on failure.
     */
    clear(): boolean;

    /**
     * Obtains multiple cache items by their unique keys.
     *
     * @param {Array<string>} keys    A list of keys that can obtained in a single operation.
     * @param {any} defaultValue Default value to return for keys that do not exist.
     * @return {Map<string,any>} A list of key => value pairs. Cache keys that do not exist or are stale will have $default as value.
     * @throws
     */
    getMultiple(keys: Array<string>, defaultValue?: any): Map<string,any>;

    /**
     * Persists a set of key => value pairs in the cache, with an optional TTL.
     *
     * @param {Map<string,any>} values A list of key => value pairs for a multiple-set operation.
     * @param {number|null} ttl Optional. The TTL value of this item. If no value is sent and
     *                                       the driver supports TTL then the library may set a default value
     *                                       for it or let the driver take care of that.
     *
     * @return {boolean} True on success and false on failure.
     * @throws
     */
   setMultiple(values: Map<string,any>, ttl?: number | null): boolean;

    /**
     * Deletes multiple cache items in a single operation.
     *
     * @param {Array<string>} keys A list of string-based keys to be deleted.
     * @return {boolean} True if the items were successfully removed. False if there was an error.
     * @throws
     */
    deleteMultiple(keys: Array<string>): boolean;

    /**
     * Determines whether an item is present in the cache.
     *
     * NOTE: It is recommended that has() is only to be used for cache warming type purposes
     * and not to be used within your live applications operations for get/set, as this method
     * is subject to a race condition where your has() will return true and immediately after,
     * another script can remove it, making the state of your app out of date.
     *
     * @param {string} key The cache item key.
     * @return {boolean}
     * @throws
     */
    has(key: string): boolean;
}