'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';
import GenerateCell from './cell-types/index';
import Row from './Row.jsx';
import RowGrouped from './RowGrouped.jsx';

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
		let rows = Store.getRows(),
			group = Store.getCurrentGroup();

		if (group && !rows[0].groupedBy) {
			rows.unshift({ value: '... ' + rows[0][group.id], groupedBy: group});
		}

		this.setState({ rows: rows });
	}

	render() {
		let genClass = (col) => {
			let classes = [styles.td];

			if (col.type.name === 'number') {
				classes.push(styles['numeric']);
			}

			return classes.join(' ');
		}

		let self = this;

		let genStyle = (col) => {
			if (col.row_style) {
				return col.row_style;
			}
		}

		let columns = Store.getColumns();

		return (
			<tbody className={styles.tbody}>
				{this.state.rows.map((item, i) => {
					{if (item.groupedBy) {
						return <RowGrouped i={i} row={item} />
					} else {
						return <Row i={i} row={item} />
					}}
				})}
			</tbody>
		);
	}
};
