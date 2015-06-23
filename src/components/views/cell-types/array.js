'use strict';

export default function(col, row) {
    let value = row[col.id];

    if (value && value.length) {
        return _.last(value)[col.type.value];
    } else {
        return col.type.default_text;
    }
};
