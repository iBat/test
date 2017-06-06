import { sortBy } from 'underscore';

export const sort = (data, [field, direction]) => {
    const sign = direction === 'asc' ? 1 : -1;
    return sortBy(data, item => item[field]*sign);
};

export const aggregate = (data) => {
    return data;
};
