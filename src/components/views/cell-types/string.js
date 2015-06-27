'use strict';

export default (col, row) => {
    let src = row[col.type.src];

    if (!row.value && col.type.src.indexOf('.') !== -1) {
        let keys = col.type.src.split('.'),
            value = row;

        keys.forEach((item) => {
            value = value[item];
        });

        src = value;
    }

    return row.value || src || '-';
};
