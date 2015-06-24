'use strict';

export default (col, row) => {
    let props = col.type.props || {},
    src = row[col.type.src];

    props.href = row[col.type.href];

    if (col.type.src.indexOf('.') !== -1) {
        let keys = col.type.src.split('.'),
            value = row;

        keys.forEach((item) => {
            value = value[item];
        });

        src = value;
    }

    props.src = src;

    return React.DOM.img(props, null);
};
