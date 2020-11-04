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
    private readonly configs: Map<string,any>;

    /**
     * Class constructor
     *
     * @param path
     */
    public constructor(path: string)
    {
        this.path    = path;
        this.configs = new Map<string,any>();

        this.load();
    }

    /**
     * @return
     */
    public get(name: string, key: string, defaultValue: any = null): any | string | null
    {
        if (!this.configs.has(name)) {
            return defaultValue;
        }

        let config: any = this.configs.get(name);

        if (config[key] === undefined) {
            return defaultValue;
        }

        return config[key];
    }

    /**
     * @return void
     */
    private load(): void
    {
        let files: Array<string> = this.getFiles();

        files.forEach(filename => {
            this.configs.set(
                filename.substr(0, filename.length - 5),
                yaml.safeLoad(fs.readFileSync(this.path + '/'  + filename, 'utf8'))
            );
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