class BaseAction {
    run () {
    }

    tryRun () {
        try {
            return this.run();
        } catch (err) {
            console.error(`Running ${this.constructor.name} on "${this.reportName}" failed: ${err.message}`);
        }
    }
    get reportName () {
        throw new Error('reportName getter must be implemented');
    }
}

exports.BaseAction = BaseAction;
