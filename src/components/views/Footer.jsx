"use strict";

import Store from "../store";
import Actions from "../actions";
import styles from "../../GridStyle.css";
import RowsPerPage from "./RowsPerPage.jsx";
import FooterButtons from "./FooterButtons.jsx";

export default class FooterView extends React.Component {

	displayName: "grid-footer"

	constructor(props) {
		super(props);
		this.state = Store.getOptions();

		this._onClick = this._onClick.bind(this);
		this._onRowsPerPageClick = this._onRowsPerPageClick.bind(this);
		this._showFooterBtn = this._showFooterBtn.bind(this);
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange.bind(this));
	}

	componentDidUpdate() {
		if (this.refs.footer) {
			this._showFooterBtn();
		}
	}

	componentWillUnmount() {
		Store.addRemoveListener(this._onChange.bind(this));
	}

	_showFooterBtn() {
		let footer = this.refs.footer.getDOMNode(),
			bounds = footer.getBoundingClientRect(),
			btnWrapper = this.refs["footer-btn-wrapper"].getDOMNode();

		if ((bounds.top + footer.offsetHeight) >= window.innerHeight) {
			React.render(<FooterButtons footerEl={footer} paging={Store.getOptions()} count={Store.getTotalCount()} />, btnWrapper);
		}
	}

	_onChange() {
		this.setState(Store.getOptions());
	}

	_onClick(e) {
		let target = e.currentTarget.getAttribute("data-direction"),
			direction = (target === "forward") ? "forward" : "back";

		if (direction === "back" && this.state.paging_from === 1) {
			return;
		}

		let next_rows = ((this.state.current_page + 1) * this.state.rows_per_page) + this.state.rows_per_page;

		if (direction === "forward" && (next_rows - this.state.rows_per_page) >= Store.getTotalCount()) {
			return;
		}

		Actions.movePage(direction);
	}

	_onRowsPerPageClick(e) {
		let menuWrapper = document.getElementById("rows-per-page");

		React.render(<RowsPerPage opts={this.state} target={e.target} el={menuWrapper}/>, menuWrapper);
	}

	render() {
		let rowsStyle = {
			marginRight: 0,
			cursor: "pointer"
		};

		if (!this.state || !this.state.paging_to) {
			return <div></div>;
		}

		return (
			<div>
				<div className={styles.footer} ref="footer">
					<div id="rows-per-page" className={styles["rows-per-page"]}></div>
					<ul className={styles.ul}>
						<li className={styles.li}>Rows per page:</li>
						<li className={styles.li} style={rowsStyle} onClick={this._onRowsPerPageClick} ><b>{this.state.rows_per_page}</b></li>
						<li className={styles.li} onClick={this._onRowsPerPageClick}><i className="material-icons">arrow_drop_down</i></li>
						<li className={styles.li}>{this.state.paging_from} - {this.state.paging_to} of {Store.getTotalCount()}</li>
						<li className={styles.li} data-direction="back" onClick={this._onClick}><i className="material-icons">chevron_left</i></li>
						<li className={styles.li} data-direction="forward" onClick={this._onClick}><i className="material-icons">chevron_right</i></li>
					</ul>
				</div>
				<div ref="footer-btn-wrapper"></div>
			</div>
		);
	}
}
