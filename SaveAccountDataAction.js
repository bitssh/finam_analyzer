const {BaseAction} = require("./BaseAction");

class SaveAccountDataAction extends BaseAction {
    /**
     *
     * @param name
     * @param cashFlow
     * @param trades
     * @param operations
     */
    constructor({name, cashFlow, trades, operations}) {
        super();
        this.name = name;
        this.cashFlow = cashFlow;
        this.trades = trades;
        this.operations = operations;

    }
    run () {
        this.validateAccountData();
    }
    validateAccountData() {

    }

}

exports.SaveAccountDataAction = SaveAccountDataAction;
