'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';

export default class ColumnsView extends React.Component {

	displayName: 'grid-columns-view'

	constructor(props) {
		super(props);
		this.state = {
			columns: this.props.columns,
			options: Store.getOptions()
		}
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		Store.addRemoveListener(this._onChange.bind(this));
	}

	_onChange() {
		// this.setState({ data: Store.getColumns() });
	}

	_onClick(e) {
		let id = e.target.getAttribute('data-column-id'),
			column = Store.getColumn(id);

		if (!column.sortable) {
			return;
		}

		Actions.sortRows(column);
	}

	render() {
		let genClass = (item) => {
			let classes = styles.th;

			if (item.active_sort) {
				classes += ' ' + styles['column-sort'];
			}

			if (Store.getSortOrder()) {
				classes += ' ' + styles['asc'];
			} else {
				classes += ' ' + styles['desc'];
			}

			if (item.type.name === 'numeric') {
				classes += ' ' + styles['numeric'];
			}

			return classes;
		}

		let genStyles = (item) => {
			if (item.style) {
				return item.style;
			}
		}

		let trClass = () => {
			let classes = styles.tr;

			classes += ' ' + styles['header'];

			return classes;
		}

		return (
			<thead className={styles.thead}>
				<tr className={trClass()}>
					<th className={styles.th} colSpan={this.state.columns.length - 1}>
						{this.state.options.title}
					</th>
					<th></th>
				</tr>
				<tr className={styles.tr}>
					{this.state.columns.map((item) => {
						return (
							<th
								key={item.id}
								className={genClass(item)}
								style={genStyles(item)}
								data-column-id={item.id}
								onClick={this._onClick}>
									{item.name}
							</th>
						);
					})}
				</tr>
			</thead>
		);
	}
};
