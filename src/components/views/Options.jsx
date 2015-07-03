/* @flow */

'use strict';

import Store from '../store';
import Actions from '../actions';
import utils from '../utils';
import styles from '../../GridStyle.css';

import Groups from './Groups.jsx';
import Search from './Search.jsx';

export default class OptionsView extends React.Component {

    displayName: 'options-view'

    constructor(props) {
        super(props);

        this._onSearchClick = this._onSearchClick.bind(this);
    }

    componentDidMount() {
        utils.dispatch('render');

        let el = document.getElementById('myDatePicker');

        let handler = (e) => {
            let action = e.detail.action;
            console.log('ACTION:: ' + e.detail.action);
            console.log('PAYLOAD:: ' + e.detail.payload);

            if (action === "DATE_SELECTED") {
                Actions.setDate(JSON.parse(e.detail.payload).date);
            }
        }

        el.addEventListener('event', handler);
    }

    _onSearchClick(e) {
        e.currentTarget.style.visibility = 'hidden';
        let el = this.refs['tools-search'].getDOMNode();

        React.render(<Search el={el} li={e.currentTarget} />, el);

        el.getElementsByTagName('input')[0].focus();
    }

    _onFilterClick(e) {
		let menuWrapper = document.getElementById('group-by');

		React.render(<Groups target={e.target} el={menuWrapper}/>, menuWrapper);
	}

    render() {
        return (
            <div className={styles['options-wrapper']}>
                <div id="group-by" className={styles['group-by']}></div>
                <div ref="tools-search"></div>
                <div className={styles['options-dates']}>
                    <react-datepicker
                        id="myDatePicker"
                        className="react-datepicker">
                    </react-datepicker>
                </div>
                <ul className={styles['options-tools']}>
                    <li onClick={this._onSearchClick}><img src="./icons/search.png" /></li>
                    <li onClick={this._onFilterClick}><img src="./icons/filter-variant.png" /></li>
                    <li><img src="./icons/settings.png" /></li>
                </ul>
            </div>
        );
    }

};
