import cellA from "./link";
import cellImg from "./img";
import cellDatetime from "./datetime";
import cellNumber from "./number";
import cellString from "./string";
import cellFunction from "./function";
import styles from "../../../GridStyle.css";

let highlight = (element, start, end) => {
    var str = element;

    str = str.substr(0, start) +
        '<span class="' + styles["search-highlight"] + '">' +
        str.substr(start, end) +
        '</span>' +
        str.substr(start + end);

    return str;
};

let createMarkup = (el, position, col, row) => {
    return {
        __html: cellFunction(col, row)
    };
};

export default (col, row) => {

    switch (col.type.name) {
        case "link":
            return cellA(col, row);
        case "image":
            return cellImg(col, row);
        case "datetime":
            return cellDatetime(col, row);
        case "number":
            return cellNumber(col, row);
        case "function":
            return <div dangerouslySetInnerHTML={createMarkup(null, null, col, row)} />;
        case "string":
            if (col.type.src) {
                return cellString(col, row);
            } else {
                if (row.match && (col.id === row.match)) {
                    let el = row.data[col.id];
                    return <div dangerouslySetInnerHTML={createMarkup(el, row.position)} />;
                }
                return row.data[col.id] || "-";
            }
            break;
        default:
            return row.data[col.id] || "-";
    }
};
