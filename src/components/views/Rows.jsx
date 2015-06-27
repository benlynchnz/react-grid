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
			let src = rows[0][group.id];

			if (group.id.split('.') !== -1) {
				let keys = group.id.split('.'),
		            value = rows[0];

		        keys.forEach((item) => {
		            value = value[item];
		        });

		        src = value;
			}

			rows.unshift({ value: '... ' + src, groupedBy: group});
		}

		this.setState({ rows: rows });
	}

	render() {
		return (
			<div className={styles.body}>
				{this.state.rows.map((item, i) => {
					{if (item.groupedBy) {
						return <RowGrouped key={i} i={i} row={item} />
					} else {
						return <Row key={i} i={i} row={item} />
					}}
				})}
			</div>
		);
	}
};
