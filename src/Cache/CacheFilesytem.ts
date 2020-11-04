'use strict';

import {CacheInterface} from "./CacheInterface";
import fs from "fs";

/**
 * Cache Yaml implementation of CacheInterface
 * @see https://www.php-fig.org/psr/psr-16/
 */
export class CacheFilesystem implements CacheInterface
{
    /** @property {string} path */
    private readonly path: string = '';

    /**
     * Class constructor
     *
     * @param {string} path of cache yaml files
     */
    public constructor(path: string)
    {
        this.path = path;
    }

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
        if (!fs.existsSync(this.path + '/' + key + '.cache')) {
            return defaultValue;
        }

        return fs.readFileSync(this.path + '/' + key + '.cache', 'utf8');
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
        fs.writeFileSync(this.path + '/' + key + '.cache', value);

        return true;
    }

    /**
     * Delete an item from the cache by its unique key.
     *
     * @param {string} key The unique cache key of the item to delete.
     * @return {boolean} True if the item was successfully removed. False if there was an error.
     * @throws
     */
    public delete(key: string): boolean {
        fs.rmSync(this.path + '/' + key + '.cache');

        return true;
    }

    /**
     * Wipes clean the entire cache's keys.
     *
     * @return {boolean} True on success and false on failure.
     */
    public clear(): boolean {
        let filenames: Array<string> = fs.readdirSync(this.path, {encoding: 'utf8'});

        filenames.forEach(filename => {
            if (filename.substr(-6) !== '.cache')
            {
                return;
            }

            this.delete(filename);
        });

        return true;
    }

    /**
     * Obtains multiple cache items by their unique keys.
     *
     * @param {Array<string>} keys    A list of keys that can obtained in a single operation.
     * @param {any} defaultValue Default value to return for keys that do not exist.
     * @return {Array<any>} A list of key => value pairs. Cache keys that do not exist or are stale will have $default as value.
     * @throws
     */
    public getMultiple(keys: Array<string>, defaultValue: any = null): Map<string,any>
    {
        let data: Map<string,any> = new Map();

        keys.forEach(key => {
            data.set(key, this.get(key, defaultValue));
        });

        return data;
    }

    /**
     * Persists a set of key => value pairs in the cache, with an optional TTL.
     *
     * @param {Array<any>} values A list of key => value pairs for a multiple-set operation.
     * @param {number|null} ttl Optional. The TTL value of this item. If no value is sent and
     *                                       the driver supports TTL then the library may set a default value
     *                                       for it or let the driver take care of that.
     *
     * @return {boolean} True on success and false on failure.
     * @throws
     */
    public setMultiple(values: Map<string,any>, ttl: number | null = null): boolean
    {
        values.forEach((value: any, key: string) => {
            this.set(key, value, ttl);
        });

        return true;
    }

    /**
     * Deletes multiple cache items in a single operation.
     *
     * @param {Array<string>} keys A list of string-based keys to be deleted.
     * @return {boolean} True if the items were successfully removed. False if there was an error.
     * @throws
     */
    public deleteMultiple(keys: Array<string>): boolean
    {
        keys.forEach(key => this.delete(key));

        return true;
    }

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
    public has(key: string): boolean
    {
        return fs.existsSync(this.path + '/' + key + '.cache');
    }
}