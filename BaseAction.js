class BaseAction {
    run () {
    }

    tryRun () {
        try {
            return this.run();
        } catch (err) {
            console.error(`Running ${this.constructor.name} on failed: ${err.message}`);
        }
    }
}

exports.BaseAction = BaseAction;
