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
			let classes = [styles.cell];

			if (col.classes) {
				col.classes.forEach((item) => {
					classes.push(styles[item]);
				});
			}

			if (col.weight || col.weight === 0) {
				classes.push(styles['w-' + col.weight]);
			}

			if (col.type.name === 'number') {
				classes.push(styles['cell-align-right']);
			}

			return classes.join(' ');
		}

		let genStyle = (col) => {
			if (col.row_style) {
				return col.row_style;
			}
		}
		
		return (
			<div key={this.props.i} className={styles.row}>
				{Store.getColumns().map((col, j) => {
					return (<div
						key={j}
						data-label={col.name}
						className={genClass(col)}
						style={genStyle(col)}>{GenerateCell(col, this.props.row.data)}
					</div>);
				})}
			</div>
		);

	}
};
