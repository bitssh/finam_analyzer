const {BaseAction} = require("./BaseAction");
const _ = require('lodash');
const {knex} = require("./db");
const moment = require('moment');

const REPORT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm:ss';

function parseReportDateTime(date, time) {
    const REPORT_UTC_OFFSET = 3;

    return moment(`${date} ${time ? time : ''}`, REPORT_DATETIME_FORMAT)
        .utcOffset(REPORT_UTC_OFFSET, true).utcOffset(REPORT_UTC_OFFSET, true).unix();
}

class SaveAccountDataAction extends BaseAction {
    /**
     *
     * @param {string} name
     * @param {Array} cashFlow
     * @param {Array <{tradeNo: number, margin: number, date: string, time: string}>} trades
     * @param {Array} operations
     */
    constructor({name, cashFlow, trades, operations}) {
        super();
        this.acctountName = name;
        this.cashFlow = cashFlow ? cashFlow : [];
        this.trades = trades ? trades : [];
        this.operations = operations ? operations : [];

    }

    run() {
        this.validateData();
        this.prepareData();
        this.saveData().then();
    }
    get reportName () {
        return this.acctountName;
    }

    validateData() {
        const tradesMargin = +this.trades
            .reduce((sum, item) => {
                return sum + item.margin
            }, 0).toFixed(2);
        if (this.cashFlow.margin && this.cashFlow.margin !== tradesMargin) {
            throw new Error(
                `Cash flow margin "${this.cashFlow.margin}" does not match trades sum margin "${tradesMargin}"`);
        }
    }

    prepareData() {
        this.trades.forEach((trade) => {
            trade.account_name = this.acctountName;
            trade.datetime = parseReportDateTime(trade.date, trade.time);
            delete trade.date;
            delete trade.time;
        });

        this.dbTradeMovements = _.remove(this.trades, trade => !trade.tradeNo).map(movement => {
            if (movement.due_date) {
                console.warn(movement);
            }

            let values = _.compact([movement.go, movement.fee, movement.margin]);
            if (values.length !== 1 ) {
                throw new Error('Trade movement contains several values' + movement);
            }

            return {
                account_name: movement.account_name,
                datetime: movement.datetime,
                type: movement.operation,
                value: values[0],
                comment: movement.comment,
                currency: movement.currency,
                code: movement.code,
                non_trade: 0,
            };
        });

        this.dbOperations = this.operations.map((operation) => {
            return {
                account_name: this.acctountName,
                datetime: parseReportDateTime(operation.date),
                type: operation.type,
                value: operation.value,
                comment: operation.comment,
                currency: operation.currency,
                code: operation.code,
                non_trade: 1,
            }
        });

        this.dbTrades = this.trades.map((trade) => {
            let result = {};
            for (let key of Object.keys(trade)) {
                if (!['go', 'due_date', 'option_price'].includes(key))
                    result[key] = trade[key];
            }
            return result;
        });
    }

    async saveData() {
        for (const operation of this.dbOperations) {
            await knex('operations').insert(operation);
        }
        for (const movement of this.dbTradeMovements) {
            await knex('operations').insert(movement);
        }
        for (const trade of this.dbTrades) {
            await knex('trades').insert(trade);
        }
    }
}

exports.SaveAccountDataAction = SaveAccountDataAction;
