import AppDispatcher from './dispatcher';
import Constants from './constants';
import API from './api';

export default {
	fetchColumns: (uri) => {
		API.fetch(uri, 'fetchColumns').then((data) => {
			AppDispatcher.dispatch({
				type: Constants.FETCH_COLUMNS,
				data: data
			});
		})
	},

	fetchRows: (uri) => {
		API.fetch(uri, 'fetchRows').then((data) => {
			AppDispatcher.dispatch({
				type: Constants.FETCH_ROWS,
				data: data
			});
		})
	},

	setDataSource: (src) => {
		AppDispatcher.dispatch({
			type: Constants.SET_DATA_SOURCE,
			data: src
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
	}

}
