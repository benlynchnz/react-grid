'use strict';

import Actions from '../actions';
import styles from '../../GridStyle.css';

export default class RowsPerPageView extends React.Component {

	displayName: 'grid-menu'

	constructor(props) {
		super(props);

		this._onClick = this._onClick.bind(this);
		this._onBlur = this._onBlur.bind(this);
	}

	_onClick(e) {
		let option = e.target.getAttribute('data-value');
		Actions.setRowsPerPage(option);
		this._onBlur();
	}

	_onBlur() {
		this.props.el.removeAttribute('style');
		React.unmountComponentAtNode(this.props.el);
	}

	render() {
		let position = this.props.target.getBoundingClientRect(),
			offsetTop = (this.props.opts.rows_per_page.length * 48);

		this.props.el.style.position = 'fixed';
		this.props.el.style.left = (position.left - 20) + 'px';
		this.props.el.style.top = (position.top - offsetTop) + 'px';
		this.props.el.style.display = 'block';

		let genClass = (item) => {
			let classes = [styles.li];

			if (item === this.props.opts.rows_per_page) {
				classes.push(styles.selected);
			}

			return classes.join(' ');
		}

		let clickHandler = (e) => {
			document.removeEventListener('click', clickHandler);
			this._onBlur();
		}

		document.addEventListener('click', clickHandler);

		return (
			<div className={styles['menu-wrapper']}>
				<ul className={styles.ul}>
					{this.props.opts.paging_options.map((item, i) => {
						return (
							<li key={i} className={genClass(item)} data-value={item} onClick={this._onClick}>{item}</li>
						);
					})}
				</ul>
			</div>
		);
	}
};
