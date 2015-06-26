'use strict';

import Store from '../store';
import styles from '../../GridStyle.css';
import GenerateCell from './cell-types/index';

export default class RowGroupedView extends React.Component {

	displayName: 'grid-rows-groupedRow'

	constructor(props) {
		super(props);
	}

	render() {
		let genRowClass = (col) => {
			let classes = [styles.row];
			classes.push(styles.group);

			return classes.join(' ');
		}

		let genClass = (col) => {
			let classes = [styles.cell];
			classes.push(styles.group);

			return classes.join(' ');
		}

		let columns = Store.getColumnCount(),
			col = Store.getColumn(this.props.row.groupedBy.id),
			row = this.props.row;

		return (
			<div key={this.props.i} className={genRowClass()}>
				<div key={this.props.row.value} className={styles.cell}>{GenerateCell(col, row)}</div>
			</div>
		);

	}
};
