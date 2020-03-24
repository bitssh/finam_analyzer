const {BaseAction} = require("./BaseAction");
const _ = require('lodash');
const {knex} = require("./db");
const moment = require('moment');

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
        this.nonTrades = _.remove(this.trades, trade => !trade.tradeNo);
        this.dbTrades = this.trades.map((trade) => {
            trade.account_name = this.acctountName;
            trade.datetime = moment(`${trade.date} ${trade.time}`, 'DD.MM.YYYY HH:mm:ss').unix();
            let result = {};
            for (let key of Object.keys(trade)) {
                if (!['date', 'time', 'go', 'due_date', 'option_price'].includes(key))
                    result[key] = trade[key];
            }
            return result;

        });
    }

    async saveData() {
        for (const trade of this.dbTrades.slice(0, 4)) {
            await knex('trades').insert(trade);
        }
    }
}

exports.SaveAccountDataAction = SaveAccountDataAction;
