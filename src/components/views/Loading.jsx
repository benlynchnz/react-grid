'use strict';

import styles from "../../GridStyle.css";
import Store from "../store";

export default class LoadingView extends React.Component {

    displayName: 'grid-loading'

    constructor(props) {
        super(props);
    }

    render() {
        let rows = Store.getOptions().rows_per_page,
            height = ((rows * 48) + (rows + 1));

        let divStyle = {
            height: height + "px"
        };

        let loadingStyle = {
            paddingTop: ((height / 2) - 20) + "px"
        };

        return (
            <div className={styles["loading-wrapper"]} style={divStyle}>
                <div style={loadingStyle}>Loading</div>
            </div>
        );
    }

};
