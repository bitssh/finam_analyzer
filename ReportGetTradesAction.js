const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');

const TRADE_FIELDS = [
    'date',
    'time',
    'market',
    'code',
    'operation',
    'count',
    'price',
    'unit',
    'option_price',
    'fee',
    'margin',
    'go',
    'currency',
    'due_date',
    'platform',
    'orderNo',
    'tradeNo',
    'comment'
];

const TRADE_FIELDS_FLOAT = [
    'price',
    'fee',
    'margin',
    'go',
];

class ReportGetTradesAction extends BaseReportTableReadAction {

    constructor(...args) {
        super(...args);
    }
    getTableCaptionNodeText() {
        return 'Торговые движения ПФИ, в т.ч. Комиссии';
    }
    getRecordFieldNames () {
        return TRADE_FIELDS;
    }
    getFloatRecordFieldNames () {
        return TRADE_FIELDS_FLOAT;
    }
    getColIndex (columnName) {
        return super.getColIndex(columnName);
    }
    validateTable() {
        super.validateTable();

        // const headerRow = _.get(this.tableNode, 'rows[0]');
        // if (!headerRow || this.getRowCellValue(headerRow, 'date') !== 'Дата сделки') {
        //     throw new Error('trade date column not found');
        // }
    }
}

exports.ReportGetTradesAction = ReportGetTradesAction;
