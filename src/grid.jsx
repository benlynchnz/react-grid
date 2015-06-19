'use strict';

import Store from './components/store';
import Actions from './components/actions';
import utils from './components/utils';
import styles from './GridStyle.css';

import Columns from './components/views/Columns.jsx';
import Rows from './components/views/Rows.jsx';

export default class GridView extends React.Component {

	displayName: 'grid-view'

	constructor(props) {
		super(props);
		this.state = {
			columns: [],
			rows: []
		};
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange.bind(this));
	}

	componentDidMount() {
		return utils.componentDidMount(this);
	}

	componentWillUnmount() {
		Store.addRemoveListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState({
			columns: Store.getColumns(),
			rows: Store.getRows()
		});
	}

	_updateState(props) {
		if (props['config']) {
			Actions.fetchColumns(props['config']);
		}

		if (props['data']) {
			Actions.fetchRows(props['data']);
		}
	}

	render() {
		if (this.state.columns.length) {
			return (
				<table className={styles.table}>
					<Columns columns={Store.getColumns()} />
					<Rows rows={Store.getRows()}/>
				</table>
			);
		}

		return <div>No Data</div>
	}
};
