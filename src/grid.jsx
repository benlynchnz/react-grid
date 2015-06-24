'use strict';

import Store from './components/store';
import Actions from './components/actions';
import utils from './components/utils';
import styles from './GridStyle.css';

import Columns from './components/views/Columns.jsx';
import Rows from './components/views/Rows.jsx';
import Footer from './components/views/Footer.jsx';

export default class GridView extends React.Component {

	displayName: 'grid-view'

	constructor(props) {
		super(props);
		this.state = {
			columns: [],
			rows: [],
			isReady: false
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
		if (Store.isReady()) {
			this.setState({
				columns: Store.getColumns(),
				rows: Store.getRows(),
				isReady: Store.isReady()
			});
		}
	}

	_updateState(props) {
		if (props['config']) {
			Actions.bootstrap(props['config']);
		} else {
			throw new Error('no config.json defined');
		}
	}

	render() {
		if (this.state.isReady) {
			return (
				<div className={styles.wrapper}>
					<table className={styles.table}>
						<Columns columns={this.state.columns} />
						<Rows rows={this.state.rows}/>
					</table>
					{Store.getOptions().show_paging ? <Footer /> : null}
				</div>
			);
		} else {
			return <div>Loading ...</div>;
		}

	}
};
