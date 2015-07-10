import Store from "../../store";
import numeral from "numeral";

export default (col, row) => {
    let value = row.data[col.id];

    return numeral(value).format(col.type.format || Store.getOptions().number_format);
};
