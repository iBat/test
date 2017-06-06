import request from 'request-promise';
import { pick } from 'underscore';
import * as strategies from './strategies';

class RedditProcessor {
    constructor(sourceUrl, outputFormat, outputFields) {
        this.sourceUrl = sourceUrl;
        this.outputFormat = outputFormat;
        this.outputFields = outputFields;
    }

    async process(operation, ...restParams) {
        return strategies[operation](await this.fetchData(), restParams);
    }

    async fetchData() {
        const httpData = await request.get({
            url: this.sourceUrl,
            json: true
        });

        return httpData.data.children.map(item => pick(item.data, this.outputFields));
    }
}

export { RedditProcessor };
