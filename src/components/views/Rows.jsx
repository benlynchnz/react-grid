'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';

export default class RowsView extends React.Component {

	displayName: 'grid-rows-cells'

	constructor(props) {
		super(props);
		this.state = this.props;
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange.bind(this));
	}
	componentWillUnmount() {

		Store.addRemoveListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState({ rows: Store.getRows() });
	}

	render() {
		let genClass = (col) => {
			let classes = styles.td;

			if (col.is_numeric) {
				classes += ' ' + styles['numeric'];
			}

			return classes;
		}

		let order = Store.getColumnSortOrder();

		let cellsOf = (item, i) => {
			let data = [];

			_.map(order, (col, j) => {
				data.push(React.DOM.td({
					key: j,
					className: genClass(col)
				}, item[col.id].toString()));
			});

			return data;
		}

		return (
			<tbody className={styles.tbody}>
				{this.state.rows.map((item, i) => {
					return (
						<tr key={i} className={styles.tr}>
							return (
								{cellsOf(item, i)}
							);
						</tr>
					);
				})}
			</tbody>
		);
	}
};
