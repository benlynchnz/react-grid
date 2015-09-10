'use strict';

// Polyfill CustomEvent for IE
try {
	new CustomEvent("test");
} catch(e) {
	let CustomEvent = (event, params) => {
		let evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
}

import Grid from './grid.jsx';

let renderHandler = () => {
	let reactComp = document.getElementsByTagName('react-grid'),
		classComp = document.getElementsByClassName('react-grid');

	Array.prototype.forEach.call(reactComp, (el) => {
	    React.render(<Grid element={el}/>, el);
	});

	Array.prototype.forEach.call(classComp, (el) => {
	    React.render(<Grid element={el}/>, el);
	});
};

if (typeof document !== 'undefined') {
	renderHandler();
}

document.addEventListener('react-grid:render', renderHandler);

export default Grid;
