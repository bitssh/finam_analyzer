const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');

const OPERATION_FIELDS = [
    'date',
    'type',
    'code',
    'currency',
    'income',
    'expense',
    'value',
    'comment',
];

const OPERATION_FIELDS_FLOAT = [
    'income',
    'expense',
    'value',
];

class ReportGetOperationsAction extends BaseReportTableReadAction {

    constructor(...args) {
        super(...args);
    }
    getTableCaptionNodeText() {
        return 'Неторговые операции с денежными средствами';
    }
    getRecordFieldNames() {
        return OPERATION_FIELDS;
    }
    getFloatRecordFieldNames() {
        return OPERATION_FIELDS_FLOAT;
    }

}

exports.ReportGetOperationsAction = ReportGetOperationsAction;
