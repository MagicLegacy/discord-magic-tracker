'use strict';

import {CacheFilesystem} from "./CacheFilesytem";

/**
 * Cache Yaml implementation of CacheInterface
 * @see https://www.php-fig.org/psr/psr-16/
 */
export class CacheFilesystemJson extends CacheFilesystem
{
    /**
     * Fetches a value from the cache.
     *
     * @param {string} key     The unique key of this item in the cache.
     * @param {any} defaultValue Default value to return if the key does not exist.
     * @return {any} The value of the item from the cache, or $default in case of cache miss.
     * @throws
     */
    public get(key: string, defaultValue: any = null): any
    {
        let value: any = super.get(key, defaultValue);

        return JSON.parse(value);
    }

    /**
     * Persists data in the cache, uniquely referenced by a key with an optional expiration TTL time.
     *
     * @param {string} key The key of the item to store.
     * @param {any} value The value of the item to store. Must be serializable.
     * @param {number|null} ttl Optional. The TTL value of this item. If no value is sent and
     *                                      the driver supports TTL then the library may set a default value
     *                                      for it or let the driver take care of that.
     *
     * @return {boolean} True on success and false on failure.
     * @throws
     */
    public set(key: string, value: any, ttl: number | null = null): boolean
    {
        let valueString: string = JSON.stringify(value);

        return super.set(key, valueString, ttl);
    }

}