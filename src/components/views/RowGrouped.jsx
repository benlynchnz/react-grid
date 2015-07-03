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

		if (!this.props.group) {
			return (<div></div>);
		}

		let genRowClass = (col) => {
			let classes = [styles.row];
			classes.push(styles.group);

			return classes.join(' ');
		};

		let genClass = (col) => {
			let classes = [styles.cell];
			classes.push(styles.group);

			return classes.join(' ');
		};

		let col = Store.getColumn(this.props.group.id),
			row = this.props.row;

		return (
			<div key={col.id} className={genRowClass()}>
				<div className={styles.cell}>{GenerateCell(col, row)}</div>
			</div>
		);

	}
};
