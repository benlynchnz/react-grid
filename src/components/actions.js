import AppDispatcher from './dispatcher';
import Constants from './constants';
import API from './api';

export default {
	bootstrap: (uri) => {
		API.bootstrap(uri).then((data) => {
			AppDispatcher.dispatch({
				type: Constants.BOOTSTRAP,
				data: data
			});
		});
	},

	fetchRows: (uri) => {
		API.fetch(uri).then((data) => {
			AppDispatcher.dispatch({
				type: Constants.FETCH_ROWS,
				data: data
			});
		});
	},

	sortRows: (column) => {
		AppDispatcher.dispatch({
			type: Constants.COL_SORT,
			data: column
		});
	},

	movePage: (direction) => {
		AppDispatcher.dispatch({
			type: Constants.MOVE_PAGE,
			data: direction
		});
	},

	setRowsPerPage: (rows) => {
		AppDispatcher.dispatch({
			type: Constants.ROWS_PER_PAGE,
			data: rows
		});
	},

	setGroup: (id) => {
		AppDispatcher.dispatch({
			type: Constants.SET_GROUP,
			data: id
		});
	},

	search: (q) => {
		AppDispatcher.dispatch({
			type: Constants.SEARCHING,
			data: q
		});
	},

	setDate: (date) => {
		AppDispatcher.dispatch({
			type: Constants.DATE_SELECTED,
			data: date
		});
	},

	setDateRange: (dates) => {
		AppDispatcher.dispatch({
			type: Constants.DATE_RANGE_CHANGE,
			data: dates
		});
	},

	setDataURI: (uri) => {
		AppDispatcher.dispatch({
			type: Constants.SET_DATA_URI,
			data: uri
		});
	},

	setElement: (el) => {
		AppDispatcher.dispatch({
			type: Constants.SET_ELEMENT,
			data: el
		});
	}

};
