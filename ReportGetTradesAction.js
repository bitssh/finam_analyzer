const {BaseReportAction} = require('./BaseReportAction');

const REPORT_TRADES_COLUMN_INDEXES = {
    Date: 1,
    Time: 2,
    Market: 3,
    Summary: 3,
    Code: 4,
    Operation: 5,
    Count: 6,
    Price: 7,
    Fee: 10,
    Margin: 11,
    GO: 12,
    Currency: 13,
    TradeNo: 17,
};

const REPORT_TRADES_COLUMN_SUMMARY_TEXT = 'ИТОГО:';

const REPORT_TRADES_TABLE_TBODY_XPATH = '/html/body/table[8]/tbody/';

class ReportGetTradesAction extends BaseReportAction {

    constructor(...args) {
        super(...args);
        this.currencies = '';

    }

    getTradeValue(row, col) {
        return this.getReportValue(`${REPORT_TRADES_TABLE_TBODY_XPATH}/tr[${row}]/th[${col}]`);
    }

    run() {
        const trades = [];
        let row = {};
        const tradeDateColumnName = this.getTradeValue(1, REPORT_TRADES_COLUMN_INDEXES.Date);
        if (tradeDateColumnName) {
            let rowIndex = 1;
            do {
                rowIndex += 1;
                row.date = this.getTradeValue(rowIndex, REPORT_TRADES_COLUMN_INDEXES.Date);
                row.code = this.getTradeValue(rowIndex, REPORT_TRADES_COLUMN_INDEXES.Code);
                row.price = this.getTradeValue(rowIndex, REPORT_TRADES_COLUMN_INDEXES.Price);
                console.log(row);
                if (row.date === '') {
                    const summaryText = this.getTradeValue(rowIndex, REPORT_TRADES_COLUMN_INDEXES.Summary);
                    if (summaryText !== REPORT_TRADES_COLUMN_SUMMARY_TEXT) {
                        console.error(summaryText, 'Trades "summary" cell not found in report ' + this.reportName);
                    }
                    break;
                }
                trades.push(row);
            } while (true);

        }
        return trades;

    }
}

exports.ReportGetTradesAction = ReportGetTradesAction;
