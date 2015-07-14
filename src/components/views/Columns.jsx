import Store from "../store";
import Actions from "../actions";
import styles from "../../GridStyle.css";
import Groups from "./Groups.jsx";

export default class ColumnsView extends React.Component {

	displayName: "grid-columns-view"

	constructor(props) {
		super(props);
		this.state = {
			options: Store.getOptions()
		};
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
		let menuWrapper = document.getElementById("group-by");

		React.render(<Groups target={e.target} el={menuWrapper}/>, menuWrapper);
	}

	render() {
		let genClass = (item) => {
			let classes = [styles.cell];

			if (item.active_sort) {
				classes.push(styles["column-sort"]);
			}

			if (Store.getSortOrder()) {
				classes.push(styles.asc);
			} else {
				classes.push(styles.desc);
			}

			if (item.type.name === "number") {
				classes.push(styles["cell-align-right"]);
			}

			if (item.classes) {
				item.classes.forEach((cls) => {
					classes.push(styles[cls]);
				});
			}

			if (item.weight || item.weight === 0) {
				classes.push(styles["w-" + item.weight]);
			}

			return classes.join(" ");
		};

		let genStyles = (item) => {
			if (item.style) {
				return item.style;
			}
		};

		let trClass = () => {
			let classes = [styles.row];
			classes.push(styles.header);

			return classes.join(" ");
		};

		return (
			<div className={styles.head}>
				<div className={trClass()}>
					{this.props.columns.map((item) => {
						return (
							<div
								key={item.id}
								className={genClass(item)}
								style={genStyles(item)}
								data-column-id={item.id}
								onClick={this._onClick}>
									{item.name}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
