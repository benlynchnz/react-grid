import styles from "../../GridStyle.css";
import utils from "../utils";
import Actions from "../actions";

export default class FooterButtons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            showItems: false
        };

        this._updateFooterBtn = this._updateFooterBtn.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onScrollTop = this._onScrollTop.bind(this);
        this._onPagingClick = this._onPagingClick.bind(this);
    }

    componentWillMount() {
        let bounds = this.props.footerEl.getBoundingClientRect();
        this.setState({ bounds: bounds, visible: true });
    }

    componentDidMount() {
        window.addEventListener("scroll", _.debounce(this._updateFooterBtn, 50));
    }

    componentDidUpdate() {
        if (this.state.showItems) {
            this._animateButtons(true);
        }
    }

    _updateFooterBtn() {
		let footer = this.props.footerEl,
			bounds = this.props.footerEl.getBoundingClientRect(),
            isVisible = this.state.showItems;

        if (isVisible) {
            this._animateButtons();
            return;
        }

		if ((bounds.top + footer.offsetHeight) >= window.innerHeight) {
            this.setState({ visible: true });
		} else {
            this.setState({ visible: false, showItems: false });
		}
	}

    _animateButtons(show) {
        if (!this.refs.items) {
            this.setState({ showItems: true });
            return;
        }

        let list = this.refs.items.getDOMNode(),
            items = list.getElementsByTagName('li'),
            animateClass = styles.hide;

        items = Array.prototype.map.call(items, (item) => {
            return item;
        });

        if (show) {
            items.reverse();
            animateClass = styles.visible;
        }

        items.forEach((item, i) => {
            _.delay(() => {
                item.classList.add(animateClass);
            }, (i * 75));
        });

        if (!show) {
            _.delay(() => {
                this.setState({ showItems: false });
            }, 500);
        }
    }

    _onClick() {
        this._animateButtons(!this.state.showItems);
    }

    _onScrollTop() {
        utils.scrollToTop(100);
        this._animateButtons();
    }

    _onPagingClick(e) {
        let direction = e.currentTarget.getAttribute('data-direction'),
            paging = this.props.paging;

        if (direction === "back" && paging.paging_from === 1) {
			return;
		}

        let next_rows = ((paging.current_page + 1) * paging.rows_per_page) + paging.rows_per_page;

		if (direction === "forward" && (next_rows - paging.rows_per_page) >= this.props.count) {
			return;
		}

        Actions.movePage(direction);
    }

    render() {
        let genClasses = () => {
            let classes = [styles["footer-btn"]];

            if (this.state.visible) {
                classes.push(styles.visible);
            }

            return classes.join(" ");
        };

        return (
            <div>
                <div
                    onClick={this._onClick}
                    style={{left: (this.state.bounds.right - 27) + "px"}}
                    className={genClasses()}>
                        <i className="material-icons">more_vert</i>
                </div>

                {(this.state.visible && this.state.showItems) ? (
                    <div style={{left: (this.state.bounds.right - 23) + "px"}} className={styles["footer-btn-options"]}>
                        <ul className={styles["footer-btn-options-list"]} ref="items">
                            <li className={styles["footer-btn-options-list-child"]} onClick={this._onScrollTop}><i className="material-icons">keyboard_arrow_up</i></li>
                            <li className={styles["footer-btn-options-list-child"]} data-direction="forward" onClick={this._onPagingClick}><i className="material-icons">chevron_right</i></li>
                            <li className={styles["footer-btn-options-list-child"]} data-direction="back" onClick={this._onPagingClick}><i className="material-icons">chevron_left</i></li>
                        </ul>
                    </div>
                ) : null}
            </div>
        );
    }
}
