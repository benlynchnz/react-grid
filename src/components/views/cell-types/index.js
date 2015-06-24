'use strict';

import A from './link';
import IMG from './img';
import DATETIME from './datetime';
import NUMBER from './number';

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
        default:
            return row[col.id] || '-';
    }
};
