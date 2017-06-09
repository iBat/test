import fs from 'fs';
import request from 'request-promise';
import { keys, isFinite, values } from 'underscore';
import * as strategies from './strategies';

class RedditProcessor {
    constructor(options) {
        this.options = options;
    }

    async process() {
        const processor = strategies[this.options.operation];
        const rawData = processor(await this.fetchData(), this.options);

        return this[`format${this.options.format}`](rawData);
    }

    async fetchData() {
        return new Promise((resolve, reject) => {
            fs.readFile('./json.json', (err, httpData) => {
                if(err) {
                    return reject(err);
                }
                resolve(JSON.parse(httpData).data.children.map(item => item.data));
            });
        })


        // const httpData = await request.get({
        //     url: this.options.sourceUrl,
        //     json: true
        // });

        // return httpData.data.children.map(item => item.data);
    }

    formatCSV(data) {
        if(!data.length)
            return '';

        const result = data.map(item => values(item).map(val => isFinite(val) ? val : `"${val}"`).join(','));

        result.unshift(`"${keys(data[0]).join('","')}"`);

        return result.join('\n');
    }

    formatSQL(data) {
        if(!data.length)
            return '';

        const table = 'table';
        const fieldsMap = {
            id: 'id',
            title: 'title',
            created_utc: 'created_utc',
            score: 'score'
        };
        const result = data.map(item =>
            `(${keys(fieldsMap).map(key => {
                const val = item[key];
                return isFinite(val) ? val : `"${val.replace(/"/g, '""')}"`;
            }).join(',')})`
        );

        result[0] = `INSERT INTO ${table} (${values(fieldsMap).join(',')}) VALUES\n${result[0]}`;

        return result.join(',\n');
    }
}

export { RedditProcessor };
