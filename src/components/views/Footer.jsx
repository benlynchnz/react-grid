'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';

import RowsPerPage from './RowsPerPage.jsx';

export default class FooterView extends React.Component {

	displayName: 'grid-footer'

	constructor(props) {
		super(props);
		this.state = Store.getOptions();

		this._onClick = this._onClick.bind(this);
		this._onRowsPerPageClick = this._onRowsPerPageClick.bind(this);
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		Store.addRemoveListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState(Store.getOptions());
	}

	_onClick(e) {
		let target = e.currentTarget.getAttribute('data-direction'),
			direction = (target === 'forward') ? 'forward' : 'back';

		if (direction === 'back' && this.state.paging_from === 1) {
			return;
		}

		let next_rows = ((this.state.current_page + 1) * this.state.rows_per_page) + this.state.rows_per_page;

		if (direction === 'forward' && (next_rows - this.state.rows_per_page) >= Store.getTotalRows()) {
			return;
		}

		Actions.movePage(direction);
	}

	_onRowsPerPageClick(e) {
		let menuWrapper = document.getElementById('rows-per-page');

		React.render(<RowsPerPage opts={this.state} target={e.target} el={menuWrapper}/>, menuWrapper);
	}

	render() {
		return (
			<div className={styles.footer}>
				<div id="rows-per-page" className={styles['rows-per-page']}></div>
				<ul className={styles.ul}>
					<li className={styles.li}>Rows per page:</li>
					<li className={styles.li} onClick={this._onRowsPerPageClick} ><b>{this.state.rows_per_page}</b><img className={styles.caret} src="./icons/menu-down.png" /></li>
					<li className={styles.li}>{this.state.paging_from} - {this.state.paging_to} of {Store.getTotalRows()}</li>
					<li className={styles.li} data-direction="back" onClick={this._onClick}><img src="./icons/chevron-left.png" /></li>
					<li className={styles.li} data-direction="forward" onClick={this._onClick}><img src="./icons/chevron-right.png" /></li>
				</ul>
			</div>
		);
	}
};
