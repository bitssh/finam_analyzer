const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');
const _ = require('lodash');

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

const TRADE_FIELDS_SUMMARY = {
    index: 3,
    name: 'summary',
    text: 'ИТОГО:',
};

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
        if (columnName === TRADE_FIELDS_SUMMARY.name) {
            return TRADE_FIELDS_SUMMARY.index;
        }
        return super.getColIndex(columnName);
    }
    validateTable() {
        super.validateTable();

        const headerRow = _.get(this.tableNode, 'rows[0]');
        if (!headerRow || this.getRowCellValue(headerRow, 'date') !== 'Дата сделки') {
            throw new Error('trade date column not found');
        }
    }
    readRow (row) {
        if (this.getRowCellValue(row, 'summary') === TRADE_FIELDS_SUMMARY.text) {
            return {doBreak: true};
        }
        return super.readRow(row);
    }
}

exports.ReportGetTradesAction = ReportGetTradesAction;
