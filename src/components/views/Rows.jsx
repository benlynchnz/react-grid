'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';
import GenerateCell from './cell-types/index';

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
			let classes = [styles.td];

			if (col.type.name === 'number') {
				classes.push(styles['numeric']);
			}

			return classes.join(' ');
		}

		let genStyle = (col) => {
			if (col.row_style) {
				return col.row_style;
			}
		}

		return (
			<tbody className={styles.tbody}>
				{this.state.rows.map((item, i) => {
					return (
						<tr key={i} className={styles.tr}>
							{Store.getColumnSortOrder().map((col, j) => {
								return (<td
									key={j}
									className={genClass(col)}
									style={genStyle(col)}>{GenerateCell(col, item)}
								</td>);
							})}
						</tr>
					);
				})}
			</tbody>
		);
	}
};
