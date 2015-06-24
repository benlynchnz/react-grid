'use strict';

import Store from '../../store';
import numeral from 'numeral';

export default (col, row) => {
    let props = col.type.props,
        value = row.value || row[col.id];

    return numeral(value).format(col.type.format || Store.getOptions().number_format);
};
