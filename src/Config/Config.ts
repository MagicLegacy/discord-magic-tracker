import fs from "fs";
import yaml from "js-yaml";

/**
 * Class config
 * Load & get config vars
 */
export class Config
{
    /** @property {string} path */
    private readonly path: string = '';

    /** @property {any} configs */
    private configs: any = {};

    /**
     * Class constructor
     *
     * @param path
     */
    public constructor(path: string)
    {
        this.path = path;

        this.load(this.getFiles());
    }

    /**
     * @return
     */
    public get(name: string, key: string, defaultValue: any = null): any | string | null
    {
        if (this.configs[name] === undefined) {
            return defaultValue;
        }

        if (this.configs[name][key] === undefined) {
            return defaultValue;
        }

        return this.configs[name][key];
    }

    /**
     * @param {Array<string>} files
     * @return void
     */
    private load(files: Array<string>): void
    {
        files.forEach(filename => {
            this.configs[filename.substr(0, filename.length - 5)] = yaml.safeLoad(fs.readFileSync(this.path + '/'  + filename, 'utf8'));
        });
    }

    /**
     * @return {Array<string>}
     */
    private getFiles(): Array<string>
    {
        let filenames: Array<string> = fs.readdirSync(this.path, {encoding: 'utf8'});
        let files: Array<string> = [];

        filenames.forEach(filename => {
            if (filename.substr(-4) !== 'yaml') {
                return;
            }

            files.push(filename);
        });

        return files;
    }
}