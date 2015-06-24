'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';
import Groups from './Groups.jsx';

export default class ColumnsView extends React.Component {

	displayName: 'grid-columns-view'

	constructor(props) {
		super(props);
		this.state = {
			options: Store.getOptions()
		}
	}

	_onClick(e) {
		let id = e.target.getAttribute('data-column-id'),
			column = Store.getColumn(id);

		if (!column.sortable) {
			return;
		}

		Actions.sortRows(column);
	}

	_onGroupByClick(e) {
		let menuWrapper = document.getElementById('group-by');

		React.render(<Groups target={e.target} el={menuWrapper}/>, menuWrapper);
	}

	render() {
		let genClass = (item) => {
			let classes = [styles.th];

			if (item.active_sort) {
				classes.push(styles['column-sort']);
			}

			if (Store.getSortOrder()) {
				classes.push(styles['asc']);
			} else {
				classes.push(styles['desc']);
			}

			if (item.type.name === 'number') {
				classes.push(styles['numeric']);
			}

			return classes.join(' ');
		}

		let genStyles = (item) => {
			if (item.style) {
				return item.style;
			}
		}

		let trClass = () => {
			let classes = [styles.tr];
			classes.push(styles['header']);

			return classes.join(' ');
		}

		return (
			<thead className={styles.thead}>
				{this.state.options.title ?
				(<tr className={trClass()}>
					<th className={styles.th} colSpan={this.props.columns.length - 1}>
						{this.state.options.title}<span className={styles['group-by-header']}>{Store.getCurrentGroup() ? 'by ' + Store.getCurrentGroup().name : null}</span>
					</th>
					<th>
						<div id="group-by" className={styles['group-by']}></div>
						<ul className={styles.ul}>
							<li className={styles.li}>Group by:</li>
							<li className={styles.li} onClick={this._onGroupByClick} >
								{Store.getCurrentGroup() ? Store.getCurrentGroup().name : 'None'}<img className={styles.caret} src="./icons/menu-down.png" /></li>
						</ul>
					</th>
				</tr>) : null}
				<tr className={styles.tr}>
					{this.props.columns.map((item) => {
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
