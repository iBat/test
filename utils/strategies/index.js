import { each, pick, sortBy, toArray } from 'underscore';

export const sort = (data, options) => {
    const field = options.field;
    const direction = options.direction;
    const outputFields = options.outputFields;
    const sign = direction === 'asc' ? 1 : -1;

    return sortBy(data, item => item[field]*sign).map(item => outputFields ? pick(item, outputFields) : item);
};

export const aggregate = (data) => {
    const field = 'domain';
    const aggregate = { };

    each(data, item => {
        aggregate[item[field]] = aggregate[item[field]] || { [field]: item[field], articlesCount: 0, scoreSumm: 0 };
        aggregate[item[field]].articlesCount += 1;
        aggregate[item[field]].scoreSumm += item.score;
    });

    return sort(toArray(aggregate), { field: 'articlesCount', direction: 'desc' });
};
