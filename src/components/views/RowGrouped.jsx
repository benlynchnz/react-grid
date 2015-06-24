'use strict';

import Store from '../store';
import styles from '../../GridStyle.css';

export default class RowGroupedView extends React.Component {

	displayName: 'grid-rows-groupedRow'

	constructor(props) {
		super(props);
	}

	render() {
		let genClass = (col) => {
			let classes = [styles.td];
			classes.push(styles.group);

			return classes.join(' ');
		}

		let columns = Store.getColumnCount();

		return (
			<tr key={this.props.i} className={styles.tr}>
				<td key={this.props.row.value} className={genClass()} colSpan={columns}>{this.props.row.value}</td>
			</tr>
		);

	}
};
