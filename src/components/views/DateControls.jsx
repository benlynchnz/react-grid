import Store from "../store";
import Actions from "../actions";
import utils from "../utils";
import styles from "../../GridStyle.css";

import Groups from "./Groups.jsx";
import Search from "./Search.jsx";

export default class DateControlsView extends React.Component {

    displayName: "options-dates"

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        utils.dispatch(document, null, null, "render");

        if (Store.getOptions().show_datepicker) {
            let el = document.getElementById('myDatePicker');

            let handler = (e) => {
                let action = e.detail.action;
                console.log('ACTION:: ' + e.detail.action);
                console.log('PAYLOAD:: ' + e.detail.payload);

                if (action === "DATE_SELECTED") {
                    Actions.setDate(JSON.parse(e.detail.payload).date);
                }

                if (action === "DATE_RANGE_CHANGE") {
                    Actions.setDateRange(JSON.parse(e.detail.payload).dates);
                }
            };

            el.addEventListener('event', handler);
        }
    }

    render() {
        let opts = Store.getOptions();

        return (
            <div className={styles["date-controls-wrapper"]}>
                {opts.show_datepicker ? (
                    <div className={styles["options-dates"]}>
                        <react-datepicker
                            id="myDatePicker"
                            data-range="true"
                            data-convenience-dates="Today,This week,Last week,This month,Last month,This year"
                            data-default-range={Store.getOptions().defaultDate}>
                        </react-datepicker>
                    </div>
                ) : null}
            </div>
        );
    }
}
