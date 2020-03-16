const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');

const OPERATION_FIELDS = [
    'date',
    'type',
    'instrument',
    'currency',
    'income',
    'expense',
    'value',
    'comment',
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

}

exports.ReportGetOperationsAction = ReportGetOperationsAction;
