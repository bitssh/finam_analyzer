const jsdomHelper = require('./jsdomHelper');

class BaseReportAction {
    constructor(jsDom) {
        this.xpathEvaluator = new jsdomHelper.XPathEvaluatorHelper(jsDom);
    }

    getReportValue (xPath) {
        return this.xpathEvaluator.evaluateStringValue(xPath);
    }

    getReportNode (xPath) {
        return this.xpathEvaluator.evaluateValue(xPath);
    }

    get reportName () {
        if (!this._reportName) {
            this._reportName = this.getReportValue('/html/body/table[1]/tbody/tr[1]/td[2]/strong');
        }
        return this._reportName;
    }

    run () {
    }

    tryRun () {
        try {
            return this.run();
        } catch (err) {
            console.error(`running ${this.constructor.name} on "${this.reportName}" failed: ${err.message}`);
        }
    }
}

exports.BaseReportAction = BaseReportAction;
