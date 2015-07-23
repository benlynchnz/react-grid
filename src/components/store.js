import {EventEmitter} from "events";
import AppDispatcher from "./dispatcher";
import Constants from "./constants";
import Actions from "./actions";

let _columns = [],
	_rows = [],
	_raw_data = [],
	_totalCount = 0,
	_sorted_rows = [],
	_search_results = null,
	_sortIndex = null,
	_isAsc = true,
	_opts = {},
	_custom_data_uri = null,
	_groups = [],
	_groupBy = null,
	_isReady = false,
	_isLoading = true,
	_element = null;

let _reqParams = {};

class Store extends EventEmitter {

	bootstrap(data) {
		this.setOptions(data);
		this.setColumns(data.columns);
		this.setDefaultColumnSort();
		this.setGroups();
		this.onBootstrapComplete();
	}

	onBootstrapComplete() {
		this.fetchRows();
	}

	fetchRows() {
		let opts = this.getOptions();

		if (opts.request && opts.request.required && opts.request.required.length) {
			let params = _.keys(_reqParams);

			let exists = _.every(opts.request.required, (item) => {
				return params.indexOf(item) !== -1;
			});

			if (!exists) {
				// return;
			}
		}

		if (this.getTotalRows() === 0 || !this.hasAllData()) {
			let uri = this.getDataURI() + this.getQueryString();
			Actions.fetchRows(uri);
			this.setLoading(true);
		}
	}

	getTotalRows() {
		let total = _rows.length;

		if (_search_results) {
			total = _search_results.length;
		}

		return total;
	}

	getQueryString() {
		let params = [];

		params.push("page=" + _opts.current_page);
		params.push("per_page=" + _opts.rows_per_page);

		if (_reqParams.query) {
			params.push("q=" + _reqParams.query.q);
		}

		if (_reqParams.sort) {
			params.push("sort=" + _reqParams.sort.field);
		}

		if (_reqParams.created) {
			params.push("created[gte]=" + _reqParams.created.from);
			params.push("created[lte]=" + _reqParams.created.to);
		}

		return "?" + params.join("&");
	}

	setPage(direction) {
		let page = _opts.current_page;

		if (direction === "forward") {
			page = page + 1;
		} else {
			page = page - 1;
		}

		_opts.current_page = page;

		this.fetchRows();
	}

	isReady() {
		return _isReady;
	}

	setReady(bool) {
		_isReady = Boolean(bool);
	}

	isLoading() {
		return _isLoading;
	}

	setLoading(bool) {
		_isLoading = Boolean(bool);
	}

	setRowsPerPage(rows) {
		_opts.rows_per_page = Number(rows);
		_opts.current_page = 0;

		this.fetchRows();
	}

	getOptions() {
		return _opts;
	}

	setOptions(data) {
		_opts.title = data.title;
		_opts.rows_per_page = data.rows_per_page;
		_opts.paging_options = data.paging_options || [5, 10, 20, 50, 100];
		_opts.default_date_format = data.default_date_format || "ddd DD MMM YYYY";
		_opts.default_number_format = data.default_number_format || "0,0";
		_opts.show_paging = data.show_paging;
		_opts.current_page = 0;
		_opts.show_datepicker = (data.show_datepicker === false) ? false : true;
		_opts.request = data.request;

		let hasDate = _.filter(data.columns, (item) => {
			return item.type.name === "datetime" && item.type.required;
		});

		if (hasDate.length) {
			_opts.defaultDate = hasDate[0].type.default;
		}
	}

	setColumns(data) {
		let non_numeric_columns = _.chain(data)
			.filter((column) => { return column.type.name !== "number"; })
			.sortBy("index")
			.value();

		let numeric_columns = _.chain(data)
			.filter((column) => { return column.type.name === "number"; })
			.sortBy("index")
			.value();

		_columns = non_numeric_columns.concat(numeric_columns).map((item, i) => {
			item.internal_idx = i;

			return item;
		});
	}

	setGroups() {
		let data = [];
		_.forEach(_columns, (item) => {
			if (item.can_group) {
				data.push(item);
			}
		});

		_groups = data;
	}

	getGroups() {
		return _groups;
	}

	setGroup(id) {
		if (id) {
			_groupBy = this.getColumn(id);
		} else {
			_groupBy = null;
		}

		this.sortRows();
	}

	getCurrentGroup() {
		return _groupBy;
	}

	getColumns() {
		let sorted = _.sortBy(_columns, "internal_idx");

		if (_groupBy) {
			sorted = _.remove(sorted, (item) => {
				return item.id !== _groupBy.id;
			});
		}

		return sorted;
	}

	getColumnCount() {
		return _columns.length;
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

	setDefaultColumnSort() {
		let column = _.findWhere(_columns, { default_sort: true });

		if (!column) {
			column = _.findWhere(_columns, { sortable: true });
		}

		column.active_sort = true;

		if (!column.ascending) {
			_isAsc = false;
		}

		_sortIndex = column.id;

		_reqParams.sort = {
			field: _isAsc ? _sortIndex : "-" + _sortIndex
		};

		this.updateColumn(column);
	}

	sortRows() {
		if (!this.hasAllData()) {
			_sorted_rows = _rows;
			return;
		}

		let rows = _search_results ? _search_results : _rows;
		let result = _.chain(rows)
			.sortBy(_sortIndex)
			.value();

		if (!_isAsc) {
			result.reverse();
		}

		if (_groupBy) {
			let grouped = _.groupBy(result, (item) => {
				if (_groupBy.id.split('.') !== -1) {
					let keys = _groupBy.id.split('.'),
			            value = item;

			        keys.forEach((key) => {
			        	value = value[key];
			        });

			        return value;
				}

				return item[_groupBy.id];
			});

			let map = [];
			_.chain(grouped)
			.pairs()
			.each((item) => {
				_.each(item[1], (row) => {
					map.push(row);
				});
			})
			.value();

			result = map;
		}

		if (_search_results) {
			_search_results = result;
		} else {
			_sorted_rows = result;
		}
	}

	getRows() {
		let __data = _search_results ? _search_results : _sorted_rows,
			start = (_opts.current_page * _opts.rows_per_page),
			end = start === 0 ? _opts.rows_per_page : (start + _opts.rows_per_page),
			rows = _.slice(__data, start, end),
			current_group = rows[0];

		// Get all the raw data rows
		let data = rows.map((item) => {
			if (!item.match) { // fix this
				return {
					is_group: false,
					data: item
				};
			} else {
				return item;
			}
		});

		// Add grouping titles
		if (_groupBy) {
			data.unshift({
				is_group: true,
				data: current_group
			});

			data.forEach((item, i) => {
				if (item.data[_groupBy.id] !== current_group[_groupBy.id]) {
					data.splice(i, 0, {
						is_group: true,
						data: item.data
					});
					current_group = item.data;
				}
			});
		}

		if (end > this.getTotalCount()) {
			end = this.getTotalCount();
		}

		this.setPaging(start, end);

		return data;
	}

	setPaging(start, end) {
		_opts.paging_from = start + 1;
		_opts.paging_to = end;
	}

	getRowAtIndex(i) {
		return this.getRows()[i];
	}

	sortColumns(column) {
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

		_reqParams.sort = {
			field: _isAsc ? _sortIndex : "-" + _sortIndex
		};

		if (!this.hasAllData()) {
			this.fetchRows();
		} else {
			this.updateColumn(column);
			this.sortRows();
		}
	}

	hasAllData() {
		return this.getTotalRows() === this.getTotalCount();
	}

	getSortOrder() {
		return _isAsc;
	}

	clearSearchRows() {
		_search_results = null;
		_reqParams.query = null;
		this.emitChange();
	}

	setDate(date) {
		let rows = _raw_data;

		_search_results = _.filter(rows, ((item) => {
			return moment(item.created_at).endOf('day').toISOString() === date;
		}));

		this.sortRows();
	}

	setDateRange(dates) {
		_reqParams.created = {
			from: dates.from,
			to: dates.to
		};

		this.fetchRows();
	}

	searchRows(q) {

		if (this.hasAllData()) {

			let columns = _.filter(_columns, ((item) => {
				return item.allow_search;
			}));

			let matches = [];

			_.forEach(_rows, ((item) => {

				_.forEach(columns, ((col) => {
					if (!item[col.id]) {
						return;
					}

					let field = item[col.id].toLowerCase();

					if (field.indexOf(q) !== -1) {
						if (!_.findWhere(matches, { data: item })) {
							matches.push({
								is_group: false,
								match: col.id,
								position: {
									start: field.indexOf(q),
									end: q.length
								},
								term: q,
								data: item
							});
						}
					}
				}));
			}));

			if (matches.length) {
				_search_results = matches;
			}

		} else {
			_reqParams.query = {
				q: q
			};

			this.fetchRows();
		}

		this.emitChange();
	}

	setDataURI(uri) {
		_custom_data_uri = uri;
	}

	getDataURI() {
		let uri = _custom_data_uri ? _custom_data_uri : _opts.request.uri;

		return uri;
	}

	setTotalCount(headers) {
		if (headers["x-total-count"]) {
			_totalCount = Number(headers["x-total-count"]);
		} else {
			_totalCount = _rows.length;
		}
	}

	getTotalCount() {
		return _totalCount;
	}

	setElement(data) {
		_element = data;
	}

	getElement() {
		return _element;
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

		case Constants.BOOTSTRAP:
			_Store.bootstrap(payload.data);
			_Store.setReady(true);
			_Store.emitChange();
			break;

		case Constants.SET_DATA_URI:
			_Store.setDataURI(payload.data);
			break;

		case Constants.FETCH_ROWS:
			let pushData = (data) => {
				data.forEach((item, i) => {
					item.$i = _opts.current_page + "." + i;
					_rows.push(item);
				});
			};

			if (_rows.length) {
				pushData(payload.data.body);
			} else {
				_rows = payload.data.body;
			}

			// _rows = payload.data.body;

			_raw_data = _rows;
			_Store.setTotalCount(payload.data.headers);
			_Store.sortRows();
			_Store.setLoading(false);
			_Store.emitChange();
			break;

		case Constants.COL_SORT:
			_Store.sortColumns(payload.data);
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

		case Constants.SET_GROUP:
			_Store.setGroup(payload.data);
			_Store.emitChange();
			break;

		case Constants.SEARCHING:
			_Store.searchRows(payload.data);
			break;

		case Constants.DATE_SELECTED:
			_Store.setDate(payload.data);
			_Store.emitChange();
			break;

		case Constants.DATE_RANGE_CHANGE:
			_Store.setDateRange(payload.data);
			_Store.emitChange();
			break;

		case Constants.SET_ELEMENT:
			_Store.setElement(payload.data);
			break;

		default:
			break;

	}
});

export default _Store;
