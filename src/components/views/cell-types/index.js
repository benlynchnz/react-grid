'use strict';

import A from './link';
import IMG from './img';
import DATETIME from './datetime';
import NUMBER from './number';
import STRING from './string';

export default (col, row) => {

    return row[col.id];
    
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
                return row.value || row[col.id] || '-';
            }
            break;
        default:
            return row.value || row[col.id] || '-';
    }
};
