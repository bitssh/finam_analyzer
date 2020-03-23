const jsdomHelper = require('./jsdomHelper');
const {BaseAction} = require("./BaseAction");

class BaseReportAction extends BaseAction {
    constructor(jsDom) {
        super();
        this.xpathEvaluator = new jsdomHelper.XPathEvaluatorHelper(jsDom);
    }
    getReportValue (xPath) {
        return this.xpathEvaluator.evaluateStringValue(xPath);
    }
    getReportNode (xPath) {
        return this.xpathEvaluator.evaluateValue(xPath);
    }
    parseFloatValue(stringValue) {
        return parseFloat(stringValue.replace(',','.').replace(' ',''));
    }
    get reportName () {
        if (!this._reportName) {
            this._reportName = this.getReportValue('/html/body/table[1]/tbody/tr[1]/td[2]/strong');
        }
        return this._reportName;
    }
}

exports.BaseReportAction = BaseReportAction;
