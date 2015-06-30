'use strict';

export default (col, row) => {
    let src = row.data[col.type.src];

    if (!row.value && col.type.src.indexOf('.') !== -1) {
        let keys = col.type.src.split('.'),
            value = row.data;

        keys.forEach((item) => {
            value = value[item];
        });

        src = value;
    }

    return src || '-';
};
