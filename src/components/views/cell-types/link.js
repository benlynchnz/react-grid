'use strict';

import styles from '../../../GridStyle.css';

let highlight = (element, start, end) => {
    var str = element;

    str = str.substr(0, start) +
        '<span class="'+styles['highlight']+'">' +
        str.substr(start, end) +
        '</span>' +
        str.substr(start + end);

    return str;
};

let createMarkup = (el, position) => {
    return {
        __html: highlight(el, position.start, position.end)
    }
};

export default (col, row) => {
    let props = col.type.props;

    props.href = row.data[col.type.href];

    if (!props.href) {
        props.href = col.type.href.uri || col.type.href;
    }

    if (col.type.href.data) {
        let data = col.type.href.data,
            src;

        data.map((item) => {
            if (item.indexOf('.') !== -1) {
                let keys = item.split('.'),
                    value = row.data;

                keys.forEach((val) => {
                    value = value[val];
                });

                src = value;
                props.href = props.href.replace('{' + item + '}', src);
            } else {
                props.href = props.href.replace('{' + item +'}', row.data[item]);
            }
        });
    }

    let result = row.data[col.type.display];

    if (row.match && (col.id === row.match)) {
        let el = result;
        result = <div dangerouslySetInnerHTML={createMarkup(el, row.position)} />
    }

    return React.DOM.a(props, result);
};
