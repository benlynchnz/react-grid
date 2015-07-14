import Store from "../store";
import Actions from "../actions";
import utils from "../utils";
import styles from "../../GridStyle.css";
import Groups from "./Groups.jsx";
import Search from "./Search.jsx";

export default class OptionsView extends React.Component {

    displayName: "options-view"

    constructor(props) {
        super(props);

        this.state = {
			options: Store.getOptions(),
            datestring: null
		};

        this._onSearchClick = this._onSearchClick.bind(this);
    }

    componentDidMount() {
        utils.dispatch(document, null, null, "render");

        if (Store.getOptions().show_datepicker) {
            let el = document.getElementById("myDatePicker");

            let handler = (e) => {
                let action = e.detail.action;
                console.log('ACTION:: ' + e.detail.action);
                console.log('PAYLOAD:: ' + e.detail.payload);

                if (action === "DATE_SELECTED") {
                    Actions.setDate(JSON.parse(e.detail.payload).date);
                }

                if (action === "DATE_RANGE_CHANGE") {
                    let dates = JSON.parse(e.detail.payload).dates,
                        from = moment(dates.from),
                        to = moment(dates.to),
                        format = Store.getOptions().default_date_format,
                        isSameDay = from.isSame(to, "day"),
                        dateString;

                    if (isSameDay) {
                        dateString = moment(dates.from).format(format);
                    } else {
                        dateString = moment(dates.from).format(format) + " to " + moment(dates.to).format(format);
                    }

                    this.setState({
                        datestring: dateString
                    });
                    Actions.setDateRange(dates);
                }
            };

            el.addEventListener("event", handler);
        }
    }

    _onSearchClick(e) {
        e.currentTarget.style.visibility = "hidden";
        let el = this.refs["tools-search"].getDOMNode();

        React.render(<Search el={el} li={e.currentTarget} target={e.target}/>, el);

        el.getElementsByTagName("input")[0].focus();
    }

    _onFilterClick(e) {
		let menuWrapper = document.getElementById("group-by");

		React.render(<Groups target={e.target} el={menuWrapper}/>, menuWrapper);
	}

    render() {
        return (
            <div>
                <div className={styles["options-wrapper"]}>
                    <div className={styles.title}>
                        <h1>{this.state.options.title}</h1>
                        <h2>{this.state.datestring}</h2>
                    </div>
                    <div id="group-by" className={styles["group-by"]}></div>
                    <div ref="tools-search"></div>
                    <ul className={styles["options-tools"]}>
                        <li onClick={this._onSearchClick}><i className="material-icons">search</i></li>
                        {Store.getGroups().length ? (<li onClick={this._onFilterClick}><i className="material-icons">filter_list</i></li>) : null}
                    </ul>
                </div>
            </div>
        );
    }
}
