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

    getReportFloatValue (xPath) {
        return this.parseFloatValue(this.getReportValue(xPath));
    }

    run () {
        const rubReportDomTrIndex = this.rubReportDomTrIndex;
        return {
            reportName: this.reportName,
            incoming: this.getReportFloatValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[2]`) || 0,
            outgoing: this.getReportFloatValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[3]`) || 0,
            margin: this.getReportFloatValue(`/html/body/table[4]/tbody/tr[${rubReportDomTrIndex}]/td[10]`) || 0,
            currencies: this.currencies,
        };

    }
}

exports.ReportGetCashFlowAction = ReportGetCashFlowAction;
