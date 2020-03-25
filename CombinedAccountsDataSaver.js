const _ = require('lodash');
const {knex} = require("./db");
const moment = require('moment');

const REPORT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm:ss';

function parseReportDateTime(date, time) {
    const REPORT_UTC_OFFSET = 3;

    return moment(`${date} ${time ? time : ''}`, REPORT_DATETIME_FORMAT)
        .utcOffset(REPORT_UTC_OFFSET, true).utcOffset(REPORT_UTC_OFFSET, true).unix();
}

class CombinedAccountsDataSaver  {
    /**
     *
     * @param {Object} accounts
     */
    constructor(accounts) {
        this.trades = [];
        this.operations = [];
        this.cashFlow = {
            incoming: 0,
            outgoing: 0,
            margin: 0,
        };

        accounts.forEach(account => {
            for (let trade of account.trades) trade.account_name = account.name;
            this.trades.push(...account.trades);

            for (let operation of account.operations) operation.account_name = account.name;
            this.operations.push(...account.operations);

            this.cashFlow.incoming += account.cashFlow.incoming;
            this.cashFlow.outgoing += account.cashFlow.outgoing;
            this.cashFlow.margin += account.cashFlow.margin;
        });

    }

    async run() {
        this.validateData();
        this.prepareData();
        await this.saveData();
    }

    validateData() {
        const tradesMargin = +this.trades
            .reduce((sum, item) => {
                return sum + item.margin
            }, 0);
        if (this.cashFlow.margin && this.cashFlow.margin.toFixed(2) !== String(tradesMargin.toFixed(2))) {
            throw new Error(
                `Cash flow margin "${this.cashFlow.margin}" does not match trades sum margin "${tradesMargin}"`);
        }
    }

    prepareData() {
        this.trades.forEach((trade) => {
            trade.datetime = parseReportDateTime(trade.date, trade.time);
            trade.date_execution = trade.date_execution ? parseReportDateTime(trade.date_execution) : trade.datetime;
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
                account_name: operation.account_name,
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
                if (!['go', 'option_price'].includes(key))
                    result[key] = trade[key];
            }
            return result;
        });
    }

    async saveData() {
        try {
            await knex('operations').del();
            await knex('trades').del();
            await knex.batchInsert('operations', this.dbOperations, 100);
            await knex.batchInsert('operations', this.dbTradeMovements, 100);
            await knex.batchInsert('trades', this.dbTrades, 30);
        } catch (err) {
            console.error(err.message);
        }
    }
}

exports.CombinedAccountsDataSaver = CombinedAccountsDataSaver;
