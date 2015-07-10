import Store from "../store";
import Constants from "../constants";
import styles from "../../GridStyle.css";
import generateCell from "./cell-types/index";
import utils from "../utils";

export default class RowView extends React.Component {

	displayName: "grid-rows-row"

	constructor(props) {
		super(props);

		this._onClick = this._onClick.bind(this);
	}

	_onClick(data) {
		utils.dispatch(Store.getElement(), Constants.ROW_CLICKED, JSON.stringify(data));
	}

	render() {
		let genClass = (col) => {
			let classes = [styles.cell];

			if (col.classes) {
				col.classes.forEach((item) => {
					classes.push(styles[item]);
				});
			}

			if (col.weight || col.weight === 0) {
				classes.push(styles["w-" + col.weight]);
			}

			if (col.type.name === "number") {
				classes.push(styles["cell-align-right"]);
			}

			return classes.join(" ");
		};

		let genStyle = (col) => {
			if (col.row_style) {
				return col.row_style;
			}
		};

		return (
			<div key={this.props.i} className={styles.row}>
				{Store.getColumns().map((col, i) => {
					return (<div
						key={i}
						data-label={col.name}
						className={genClass(col)}
						onClick={this._onClick.bind(this, this.props.row.data)}
						style={genStyle(col)}>{generateCell(col, this.props.row)}
					</div>);
				})}
			</div>
		);

	}
}
