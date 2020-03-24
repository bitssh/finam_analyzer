const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');

const FIELDS_META = {
    date: {
        columnName: 'Дата',
    },
    type: {
        columnName: 'Тип операции',
    },
    code: {
        columnName: 'Финансовый инструмент',
    },
    currency: {
        columnName: 'Валюта',
    },
    income: {
        columnName: 'Зачислено',
        numeric: true,
    },
    expense: {
        columnName: 'Списано',
        numeric: true,
    },
    value: {
        columnName: 'Оценка',
        numeric: true,
    },
    comment: {
        columnName: 'Комментарии',
    },
};

class ReportGetOperationsAction extends BaseReportTableReadAction {

    constructor(...args) {
        super(...args);
    }
    getTableCaptionNodeText() {
        return 'Неторговые операции с денежными средствами';
    }
    getFieldsMeta() {
        return FIELDS_META;
    }

}

exports.ReportGetOperationsAction = ReportGetOperationsAction;
