'use strict';

let utils = {};

let componentDidMount = (ctx) => {
    let rootNode = React.findDOMNode(ctx),
		hasNextProps = false,
		nextProps = {},
		parentNode = rootNode.parentNode;

	Object.keys(parentNode.attributes).forEach(function(key) {
		let namedNode;

		if (key !== 'length') {
			hasNextProps = true;
			namedNode = parentNode.attributes[key];
			nextProps[namedNode.name] = namedNode.value;
		}
	});

	if (hasNextProps) {
	       ctx._updateState(nextProps);
	}

	ctx.setState({ element: ctx.props.element });
};

utils.componentDidMount = componentDidMount;

let dispatch = (action, payload) => {
    let event = new CustomEvent('render', {
        'detail': {action, payload}
    });

    document.dispatchEvent(event);
}

utils.dispatch = dispatch;

export default utils;
