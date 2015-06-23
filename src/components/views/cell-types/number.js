'use strict';

import Store from '../../store';
import numeral from 'numeral';

export default function(col, row) {
    let props = col.type.props,
        value = row[col.id];

    console.log(value);

    return numeral(value).format(col.type.format || Store.getOptions().number_format);
};
