import {EventEmitter} from 'events';
import AppDispatcher from './dispatcher';
import Constants from './constants';

let _data = [];
let _columns = [];
let _rows = [];
let _sortIndex = null;
let _asc = true;
let _opts = {};

class Store extends EventEmitter {

	getData() {
		return _data;
	}

	setOptions(data) {
		_opts.title = data.title;
	}

	getOptions() {
		return _opts;
	}

	setColumns(data) {
		_columns = data;
	}

	getColumns() {
		let string_columns = _.chain(_columns)
			.filter((column) => { return !column.is_numeric })
			.sortBy('index')
			.value();

		let numeric_columns = _.chain(_columns)
			.filter((column) => { return column.is_numeric })
			.sortBy('index')
			.value();

		return string_columns.concat(numeric_columns);
	}

	getColumnSortOrder() {
		let order = _.map(this.getColumns(), (item, i) => {
			return {
				id: item.id,
				position: i,
				is_numeric: item.is_numeric
			}
		});

		return order;
	}

	getColumn(id) {
		return _.findWhere(_columns, { id: id });
	}

	getColumnAtIndex(i) {
		return this.getColumns()[i];
	}

	updateColumn(column) {
		let idx = _.findWhere(_columns, { id: column.id });
		_.pull(_columns, idx);
		_columns.push(column);
	}

	setDefaults(data) {
		let column = _.findWhere(_columns, { default_sort: true });

		if (!column) {
			column = _.findWhere(_columns, { sortable: true });
		}

		column.active_sort = true;
		_sortIndex = column.id;

		this.updateColumn(column);
	}

	getRows() {
		let result = _.sortBy(_rows, _sortIndex);

		if (!_asc) {
			result.reverse();
		}

		return result;
	}

	getRowAtIndex(i) {
		return this.getRows()[i];
	}

	sortRows(column) {
		if (_sortIndex !== column.id) {
			_asc = false;
		} else {
			_asc = !_asc;
		}

		_columns.forEach((item) => {
			item.active_sort = false;
		});

		column.active_sort = true;
		_sortIndex = column.id;

		this.updateColumn(column);
	}

	getSortOrder() {
		return _asc;
	}

	emitChange() {
		this.emit(Constants.CHANGE);
	}

	addChangeListener(cb) {
		this.on(Constants.CHANGE, cb);
	}

	removeChangeListener(cb) {
		this.removeListener(Constants.CHANGE, cb);
	}
}

let _Store = new Store();

_Store.dispatchToken = AppDispatcher.register((payload) => {
	switch(payload.type) {
		case Constants.FETCH_COLUMNS:
			_Store.setColumns(payload.data.columns);
			_Store.setDefaults(payload.data);
			_Store.setOptions(payload.data);
			_Store.emitChange();
			break;
		case Constants.FETCH_ROWS:
			_rows = payload.data.Items;
			_Store.emitChange();
			break;
		case Constants.COL_SORT:
			_Store.sortRows(payload.data);
			_Store.emitChange();
			break;
		default:
			break;
	}
});

export default _Store;
