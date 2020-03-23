const {BaseAction} = require("./BaseAction");
const _ = require('lodash');

class SaveAccountDataAction extends BaseAction {
    /**
     *
     * @param {string} name
     * @param {Array} cashFlow
     * @param {Array <{tradeNo: number, margin: number}>} trades
     * @param {Array} operations
     */
    constructor({name, cashFlow, trades, operations}) {
        super();
        this.name = name;
        this.cashFlow = cashFlow ? cashFlow : [];
        this.trades = trades ? trades : [];
        this.operations = operations ? operations : [];

    }

    run() {
        this.validateAccountData();
        this.prepareAccountData();
    }
    get reportName () {
        return this.name;
    }

    validateAccountData() {
        const tradesMargin = +this.trades
            .reduce((sum, item) => {
                return sum + item.margin
            }, 0).toFixed(2);
        if (this.cashFlow.margin && this.cashFlow.margin !== tradesMargin) {
            throw new Error(
                `Cash flow margin "${this.cashFlow.margin}" does not match trades sum margin "${tradesMargin}"`);
        }
        console.log('  ' + this.trades.length, tradesMargin, this.cashFlow.margin)
    }

    prepareAccountData() {
        this.nonTrades = _.remove(this.trades, trade => !trade.tradeNo);

    }
}

exports.SaveAccountDataAction = SaveAccountDataAction;
