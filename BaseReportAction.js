const jsdom = require("jsdom");

const getDomValue = (dom, xPath) => dom.window.document.evaluate(xPath, dom.window.document, null, 2)._value;

class BaseReportAction {
    constructor(jsDom) {
        this.reportDom = jsDom;
    }

    getReportValue (xPath) {
        return getDomValue(this.reportDom, xPath);
    }

    get reportName () {
        return this.getReportValue('/html/body/table[1]/tbody/tr[1]/td[2]/strong');
    }

    run () {
    }
}


exports.BaseReportAction = BaseReportAction;
