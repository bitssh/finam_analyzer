const {BaseReportTableReadAction} = require('./BaseReportTableReadAction');

const FIELDS_META = {
    date: {
        columnName: 'Дата сделки',
    },
    time: {
        columnName: 'Время сделки',
    },
    market: {
        columnName: 'Вид договора',
    },
    code: {
        columnName: 'Код',
    },
    operation: {
        columnName: 'Вид сделки',
    },
    price: {
        columnName: 'Цена исполнения/',
        numeric: true,
    },
    count: {
        columnName: 'Количество (шт.)',
        numeric: true,
    },
    unit: {
        columnName: 'Единица измерения цены',
    },
    option_price: {
        columnName: 'Цена исполнения по опциону',
        numeric: true,
    },
    fee: {
        columnName: 'Вознаграждение',
        numeric: true,
    },
    margin: {
        columnName: 'Вариационная маржа',
        numeric: true,
    },
    go: {
        columnName: 'ГО',
        numeric: true,
    },
    currency: {
        columnName: 'Валюта',
    },
    due_date: {
        columnName: 'Дата исполнения',
        optional: true,
    },
    platform: {
        columnName: 'Площадка',
    },
    tradeNo: {
        columnName: '№ сделки',
    },
    orderNo: {
        columnName: 'Номер биржевойзаявки',
    },
    comment: {
        columnName: 'Комментарии',
    },
};

class ReportGetTradesAction extends BaseReportTableReadAction {

    constructor(...args) {
        super(...args);
    }
    getTableCaptionNodeText() {
        return 'Торговые движения ПФИ, в т.ч. Комиссии';
    }
    getFieldsMeta () {
        return FIELDS_META;
    }
    getColIndex (columnName) {
        return super.getColIndex(columnName);
    }
    validateTable() {
        super.validateTable();

        // const headerRow = _.get(this.tableNode, 'rows[0]');
        // if (!headerRow || this.getRowCellValue(headerRow, 'date') !== 'Дата сделки') {
        //     throw new Error('trade date column not found');
        // }
    }
}

exports.ReportGetTradesAction = ReportGetTradesAction;
