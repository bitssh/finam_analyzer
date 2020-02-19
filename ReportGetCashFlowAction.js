const {BaseReportAction} = require('./BaseReportAction');

class ReportGetCashFlowAction extends BaseReportAction {

    constructor(...args) {
        super(...args);
        this.currencies = '';

    }
    get rubReportDomTrIndex () {
        for (let index = 3; index < 6; index += 1) {
            let currency = this.getReportValue(`/html/body/table[4]/tbody/tr[${index}]/td[1]`);
            if (currency) {
                if (currency === 'Рубль') {
                    return index;
                } else {
                    this.currencies += currency + ' ';
                }
            }
        }
        return 1;
    }

    run () {
        const rubReportDomTrIndex = this.rubReportDomTrIndex;
        return {
            reportName: this.reportName,
            incoming: this.getReportValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[2]`),
            outgoing: this.getReportValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[3]`),
            margin: this.getReportValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[10]`),
            currencies: this.currencies,
        };

    }
}

exports.ReportGetCashFlowAction = ReportGetCashFlowAction;
