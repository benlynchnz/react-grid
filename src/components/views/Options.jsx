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
                        <div
                            id="myDatePicker2"
                            data-range="true"
                            data-default-range="This month"
                            className="react-datepicker">
                        </div>
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
