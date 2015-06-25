'use strict';

export default (col, row) => {
    let props = col.type.props;

    props.href = row[col.type.href];

    if (!props.href) {
        props.href = col.type.href.uri || col.type.href;
    }

    if (col.type.href.data) {
        let data = col.type.href.data,
            src;

        data.map((item) => {
            if (item.indexOf('.') !== -1) {
                let keys = item.split('.'),
                    value = row;

                keys.forEach((val) => {
                    value = value[val];
                });

                src = value;
                props.href = props.href.replace('{' + item + '}', src);
            } else {
                props.href = props.href.replace('{' + item +'}', row[item]);
            }
        });
    }

    return React.DOM.a(props, row[col.type.display]);
};
