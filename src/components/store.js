import {EventEmitter} from 'events';
import AppDispatcher from './dispatcher';
import Constants from './constants';
import Actions from './actions';

let _columns = [],
	_rows = [],
	_sortIndex = null,
	_isAsc = true,
	_opts = {},
	_isReady = false,
	_dataSource = null;

class Store extends EventEmitter {

	getTotalRows() {
		return _rows.length;
	}

	setPage(direction) {
		let page = _opts.current_page;

		if (direction === 'forward') {
			page = page + 1;
		} else {
			page = page - 1;
		}

		_opts.current_page = page;
	}

	setDataSource(src) {
		_dataSource = src;
	}

	getDataSource() {
		return _dataSource;
	}

	isReady() {
		return _isReady;
	}

	setReady(bool) {
		_isReady = Boolean(bool);
	}

	setRowsPerPage(rows) {
		_opts.rows_per_page = Number(rows);
		_opts.current_page = 0;
	}

	getOptions() {
		return _opts;
	}

	setOptions(data) {
		_opts.title = data.title;
		_opts.rows_per_page = data.rows_per_page;
		_opts.paging_options = data.paging_options || [5, 10, 20, 50, 100];
		_opts.default_date_format = data.default_date_format || "ddd DD MMM YYYY";
		_opts.show_paging = data.show_paging;
		_opts.current_page = 0;
		_opts.endpoint = data.endpoint;
	}

	setColumns(data) {
		_columns = data;
	}

	getColumns() {
		let non_numeric_columns = _.chain(_columns)
			.filter((column) => { return column.type.name !== 'numeric' })
			.sortBy('index')
			.value();

		let numeric_columns = _.chain(_columns)
			.filter((column) => { return column.type.name === 'numeric' })
			.sortBy('index')
			.value();

		return non_numeric_columns.concat(numeric_columns);
	}

	getColumnSortOrder() {
		let order = _.map(this.getColumns(), (item, i) => {
			return item;
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

		if (!column.ascending) {
			_isAsc = false;
		}

		_sortIndex = column.id;

		this.updateColumn(column);
	}

	getRows() {
		let result = _.chain(_rows)
			.sortBy(_sortIndex)
			.value()

		if (!_isAsc) {
			result.reverse();
		}

		if (result.length) {
			let records = _.slice(result, (_opts.current_page * _opts.rows_per_page), (_opts.rows_per_page * (_opts.current_page + 1)));
			_opts.current_page_records = records.length;
			_opts.paging_from = (_opts.current_page * _opts.rows_per_page) + 1;

			if (_opts.current_page_records < _opts.rows_per_page) {
				_opts.paging_to = _opts.paging_from + (_opts.current_page_records - 1);
			} else {
				_opts.paging_to = _opts.paging_from + (_opts.rows_per_page - 1);
			}

			return records;
		}

		return result;
	}

	getRowAtIndex(i) {
		return this.getRows()[i];
	}

	sortRows(column) {
		if (_sortIndex !== column.id) {
			_isAsc = false;
		} else {
			_isAsc = !_isAsc;
		}

		_columns.forEach((item) => {
			item.active_sort = false;
		});

		column.active_sort = true;
		_sortIndex = column.id;

		this.updateColumn(column);
	}

	getSortOrder() {
		return _isAsc;
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
		case Constants.SET_DATA_SOURCE:
			_Store.setDataSource(payload.data);
			_Store.emitChange();
			break;
		case Constants.FETCH_ROWS:
			_rows = payload.data;
			_Store.setReady(true);
			_Store.emitChange();
			break;
		case Constants.COL_SORT:
			_Store.sortRows(payload.data);
			_Store.emitChange();
			break;
		case Constants.MOVE_PAGE:
			_Store.setPage(payload.data);
			_Store.emitChange();
			break;
		case Constants.ROWS_PER_PAGE:
			_Store.setRowsPerPage(payload.data);
			_Store.emitChange();
			break;
		default:
			break;
	}
});

export default _Store;
