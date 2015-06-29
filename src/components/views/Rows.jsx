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
	}

	render() {
		return (
			<div className={styles.body}>
				{this.props.rows.map((item, i) => {
					{if (item.is_group) {
						return <RowGrouped row={item} group={Store.getCurrentGroup()} />
					} else {
						return <Row key={i} i={i} row={item} />
					}}
				})}
			</div>
		);
	}
};
