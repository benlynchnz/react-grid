'use strict';

import Actions from '../actions';
import Store from '../store';
import styles from '../../GridStyle.css';

export default class SearchView extends React.Component {

    displayName: 'search-view'

    constructor(props) {
        super(props);

        this._onBlur = this._onBlur.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onSearchClear = this._onSearchClear.bind(this);
    }

    _onBlur(e) {
        if (!e || !e.target.value) {
            this.props.li.style.visibility = 'visible';
		    React.unmountComponentAtNode(this.props.el);
        } else {

        }
    }

    _onFocus(e) {
        let keyHandler = (e) => {
            let value = e.target.value;

            if (e.which === 13) {
                Actions.search(value);
                this._onBlur(e);
            }

            if (e.which === 27) {
                Store.clearSearchRows();
                this._onBlur(e);
            }

            if (!value) {
                Store.clearSearchRows();
            }
        }

        e.target.addEventListener('keyup', keyHandler);
    }

    _onSearchClear() {
        Store.clearSearchRows();
        this._onBlur();
    }

    render() {
        let pos = this.props.target.getBoundingClientRect();

        let inputStyle = {
            left: (pos.right - 300) + 'px'
        };

        return (
            <div className={styles['input-container']} style={inputStyle}>
                <input type="text" onBlur={this._onBlur} onFocus={this._onFocus} required />
                <span className={styles['highlight']}></span>
                <span className={styles['bar']}></span>
                <img src="./icons/close.png" onClick={this._onSearchClear}/>
            </div>
        );
    }

};
