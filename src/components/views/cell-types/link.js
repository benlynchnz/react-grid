'use strict';

export default function(col, row) {
    let props = col.type.props;

    props.href = row[col.type.href];

    return React.DOM.a(props, row[col.type.display]);
};
