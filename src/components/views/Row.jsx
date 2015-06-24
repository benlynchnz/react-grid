'use strict';

import Store from '../store';
import styles from '../../GridStyle.css';
import GenerateCell from './cell-types/index';

export default class RowView extends React.Component {

	displayName: 'grid-rows-row'

	constructor(props) {
		super(props);
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

		let columns = Store.getColumns();

		return (
			<tr key={this.props.i} className={styles.tr}>
				{columns.map((col, j) => {
					return (<td
						key={j}
						className={genClass(col)}
						style={genStyle(col)}>{GenerateCell(col, this.props.row)}
					</td>);
				})}
			</tr>
		);

	}
};
