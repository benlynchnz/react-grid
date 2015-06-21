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

			if (col.type.name === 'numeric') {
				classes += ' ' + styles['numeric'];
			}

			return classes;
		}

		let genStyle = (col) => {
			if (col.row_style) {
				return col.row_style;
			}
		}

		let genValue = (col, row) => {
			let result = row[col.id];

			if (col.type.name === 'date') {
				result = moment(result).format(col.type.format);
			}

			if (col.type.name === 'array') {
				if (result && result.length) {
					result = _.last(result)[col.type.value];
				} else {
					result = col.type.default_text;
				}
			}

			return result || '-';
		}

		let order = Store.getColumnSortOrder();

		let cellsOf = (item) => {
			let data = [];

			_.map(order, (col, j) => {
				data.push(React.DOM.td({
					key: j,
					className: genClass(col),
					style: genStyle(col)
				}, genValue(col, item).toString()));
			});

			return data;
		}

		return (
			<tbody className={styles.tbody}>
				{this.state.rows.map((item, i) => {
					return (
						<tr key={i} className={styles.tr}>
							return (
								{cellsOf(item)}
							);
						</tr>
					);
				})}
			</tbody>
		);
	}
};
