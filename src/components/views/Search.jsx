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
    }

    _onBlur(e) {
        if (!e.target.value) {
            this.props.li.style.visibility = 'visible';
		    React.unmountComponentAtNode(this.props.el);
        }
    }

    _onFocus(e) {
        console.log('focus');

        let keyHandler = (e) => {
            let value = e.target.value;

            if (e.which === 13) {
                console.log(value);
                Actions.search(value);
                // this._onBlur();
            }

            if (e.which === 27) {
                Store.clearSearchRows();
                this._onBlur();
            }

            if (!value) {
                Store.clearSearchRows();
            }
        }

        e.target.addEventListener('keyup', keyHandler);
    }

    render() {
        return (
            <input type="text" onBlur={this._onBlur} onFocus={this._onFocus} required />
        );
    }

};
