const XPATH_RESULT = {
    ANY_TYPE: 0,
    NUMBER_TYPE: 1,
    STRING_TYPE: 2,
    BOOLEAN_TYPE: 3,
    UNORDERED_NODE_ITERATOR_TYPE: 4,
    ORDERED_NODE_ITERATOR_TYPE: 5,
    UNORDERED_NODE_SNAPSHOT_TYPE: 6,
    ORDERED_NODE_SNAPSHOT_TYPE: 7,
    ANY_UNORDERED_NODE_TYPE: 8,
    FIRST_ORDERED_NODE_TYPE: 9,
};

class XPathEvaluatorHelper {
    constructor(dom) {
        this.dom = dom;
        this.contextNode = null;
    }

    evaluateValue(xPath, type = XPATH_RESULT.ANY_TYPE) {
        const contextNode = this.contextNode ? this.contextNode : this.dom.window.document;
        return this.dom.window.document.evaluate(xPath, contextNode, null, type)._value;
    }
    evaluateStringValue(xPath) {
        return this.evaluateValue(xPath, XPATH_RESULT.STRING_TYPE);
    }
}

exports.XPathEvaluatorHelper = XPathEvaluatorHelper;
