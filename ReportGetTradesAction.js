const {BaseReportAction} = require('./BaseReportAction');
const _ = require('lodash');

const REPORT_TRADES_COLUMNS = [
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

const colIndex = columnName => {
    if (columnName === REPORT_TRADES_COLUMN_SUMMARY.name) {
        return REPORT_TRADES_COLUMN_SUMMARY.index;
    }
    return REPORT_TRADES_COLUMNS.findIndex((column) => column === columnName);
};

const REPORT_TRADES_COLUMN_SUMMARY = {
    index: 3,
    name: 'summary',
    text: 'ИТОГО:',
};

function getRowCellValue(rowNode, columnName) {
    const cell = rowNode.cells[colIndex(columnName)];
    return cell ? cell.textContent : null;
}

class ReportGetTradesAction extends BaseReportAction {

    constructor(...args) {
        super(...args);
        this.tradesTableNode = this.getReportTableNode('Торговые движения ПФИ, в т.ч. Комиссии');
    }

    validateTradeTable() {
        if (!this.tradesTableNode) {
            throw new Error('trade table not found');
        }
        const headerRow = _.get(this.tradesTableNode, 'rows[0]');
        if (!headerRow || getRowCellValue(headerRow, 'date') !== 'Дата сделки') {
            throw new Error('trade date column not found');
        }
    }

    run() {
        this.validateTradeTable();
        const trades = [];
        for (let i = 1; i < this.tradesTableNode.rows.length; i += 1) {
            let trade = {};
            const row = this.tradesTableNode.rows[i];
            if (getRowCellValue(row, 'summary') === REPORT_TRADES_COLUMN_SUMMARY.text) {
                break;
            }
            for (let column of REPORT_TRADES_COLUMNS) {
                trade[column] = getRowCellValue(row, column);
            }
            trades.push(trade);
        }
        return trades;

    }
}

exports.ReportGetTradesAction = ReportGetTradesAction;
