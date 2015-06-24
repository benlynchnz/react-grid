'use strict';

import Store from '../../store';

export default (col, row) => {
    let props = col.type.props,
        value = row[col.id];

    if (col.type.from_now) {
        return moment(value).fromNow();
    } else {
        return moment(value).format(col.type.format || Store.getOptions().default_date_format);
    }
};
