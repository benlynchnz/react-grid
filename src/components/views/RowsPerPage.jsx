'use strict';

import Actions from '../actions';
import styles from '../../GridStyle.css';

export default class RowsPerPageView extends React.Component {

	displayName: 'grid-menu'

	constructor(props) {
		super(props);

		this._onClick = this._onClick.bind(this);
	}

	_onClick(e) {
		let option = e.target.getAttribute('data-value');
		Actions.setRowsPerPage(option);

		this.props.el.removeAttribute('style');
		React.unmountComponentAtNode(this.props.el);
	}

	render() {
		let genClass = (item) => {
			let classes = [styles.li];

			if (item === this.props.opts.rows_per_page) {
				classes.push(styles.selected);
			}

			return classes.join(' ');
		}

		return (
			<div className={styles['menu-wrapper']}>
				<ul className={styles.ul}>
					{this.props.opts.pagingOpts.map((item, i) => {
						return (
							<li key={i} className={genClass(item)} data-value={item} onClick={this._onClick}>{item}</li>
						);
					})}
				</ul>
			</div>
		);
	}
};
