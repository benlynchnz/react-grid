'use strict';

import A from './link';
import IMG from './img';
import DATETIME from './datetime';
import NUMBER from './number';
import STRING from './string';
import styles from '../../../GridStyle.css';

let highlight = (element, start, end) => {
    var str = element;

    str = str.substr(0, start) +
        '<span class="'+styles['search-highlight']+'">' +
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

    switch (col.type.name) {
        case 'link':
            return A(col, row);
            break;
        case 'image':
            return IMG(col, row);
            break;
        case 'datetime':
            return DATETIME(col, row);
            break;
        case 'array':
            return ARRAY(col, row);
            break;
        case 'number':
            return NUMBER(col, row);
            break;
        case 'string':
            if (col.type.src) {
                return STRING(col, row);
            } else {
                if (row.match && (col.id === row.match)) {
                    let el = row.data[col.id];
                    return <div dangerouslySetInnerHTML={createMarkup(el, row.position)} />
                }
                return row.data[col.id] || '-';
            }
            break;
        default:
            return row.data[col.id] || '-';
    }
};
