import Store from './components/store';
import Actions from './components/actions';
import utils from './components/utils';
import styles from './GridStyle.css';

import Columns from './components/views/Columns.jsx';
import Rows from './components/views/Rows.jsx';
import Footer from './components/views/Footer.jsx';
import Options from './components/views/Options.jsx';
import DateControls from './components/views/DateControls.jsx';
import Loading from './components/views/Loading.jsx';

export default class GridView extends React.Component {

	displayName: 'grid-view'

	constructor(props) {
		super(props);

		this.state = {
			columns: [],
			rows: [],
			isReady: false,
			isLoading: true
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
			let rows = Store.getRows();

			this.setState({
				columns: Store.getColumns(),
				rows: rows,
				isReady: Store.isReady(),
				isLoading: Store.isLoading()
			});
		}
	}

	_updateState(props) {
		if (props.config) {
			Actions.bootstrap(props.config);
		} else {
			throw new Error("no config.json defined");
		}

		if (props["request-uri"]) {
			Actions.setDataURI(props["request-uri"]);
		}

		Actions.setElement(this.props.element);
	}

	render() {
		if (this.state.isReady) {
			return (
				<div>
				<DateControls />
				<div className={styles.wrapper}>
					<div className={styles.table}>
						<Options />
						<Columns columns={this.state.columns} />
						{this.state.isLoading ? <Loading /> : <Rows rows={this.state.rows} />}
					</div>
					{Store.getOptions().show_paging ? <Footer /> : null}
				</div>
			</div>
			);
		} else {
			return (
				<div className={styles.wrapper}></div>
			);
		}

	}
};
