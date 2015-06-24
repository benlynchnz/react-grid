'use strict';

import Store from '../store';
import Actions from '../actions';
import styles from '../../GridStyle.css';

export default class GroupsMenu extends React.Component {

	displayName: 'grid-groups'

	constructor(props) {
		super(props);

		this._onClick = this._onClick.bind(this);
		this._onBlur = this._onBlur.bind(this);
	}

	_onBlur() {
		this.props.el.removeAttribute('style');
		React.unmountComponentAtNode(this.props.el);
	}

	_onClick(e) {
		let option = e.target.getAttribute('data-value');
		Actions.setGroup(option);
		this._onBlur();
	}

	render() {
		let position = this.props.target.getBoundingClientRect();

		this.props.el.style.position = 'fixed';
		this.props.el.style.left = (position.left - 20) + 'px';
		this.props.el.style.top = position.top + 'px';
		this.props.el.style.display = 'block';

		let genClass = (item) => {
			let classes = [styles.li];

			if (Store.getCurrentGroup() && (item.name === Store.getCurrentGroup().name)) {
				classes.push(styles.selected);
			} else if (!Store.getCurrentGroup() && item.name === "None") {
				classes.push(styles.selected);
			}

			return classes.join(' ');
		}

		let clickHandler = (e) => {
			document.removeEventListener('click', clickHandler);
			this._onBlur();
		}

		document.addEventListener('click', clickHandler);

		let groups = [{ id: null, name: 'None' }];

		Store.getGroups().forEach((item) => {
			groups.push(item);
		});

		return (
			<div className={styles['menu-wrapper']}>
				<ul className={styles.ul}>
					{groups.map((item, i) => {
						return (
							<li key={i} className={genClass(item)} data-value={item.id} onClick={this._onClick}>{item.name}</li>
						);
					})}
				</ul>
			</div>
		);

	}
};
