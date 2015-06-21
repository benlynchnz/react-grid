import AppDispatcher from './dispatcher';
import Constants from './constants';
import API from './api';

export default {
	fetchColumns: (uri) => {
		API.fetch(uri).then((data) => {
			AppDispatcher.dispatch({
				type: Constants.FETCH_COLUMNS,
				data: data
			});
		})
	},

	fetchRows: (uri) => {
		API.fetch(uri).then((data) => {
			AppDispatcher.dispatch({
				type: Constants.FETCH_ROWS,
				data: data
			});
		})
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
	}

}
