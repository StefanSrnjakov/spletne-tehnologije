const getUniqueRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

class VElement {
    constructor(tag, props = {}, children = [], _el = null) {
        if (typeof tag !== 'string' || tag.trim() === '') {
            throw new Error('Invalid tag: Tag must be a non-empty string.');
        }
        this.tag = tag;

        if (typeof props !== 'object' || props === null || Array.isArray(props)) {
            throw new Error('Invalid props: Props must be a valid object.');
        }

        for (let key in props) {
            if (forbiddenProps.includes(key)) {
                throw new Error(`Forbidden prop used: "${key}" is not allowed.`);
            }
        }
        this.props = props;

        if (!Array.isArray(children)) {
            throw new Error('Invalid children: Children must be an array.');
        }
        this.children = children;
        this._el = _el;
    }

    addChildren(child) { }
    render() { }
    addDummyChilds(childNum, childTag) { }
    recursiveDeepClone() { }
    modifyRandomChilds() { }

    addChildren(child) {
        if (child instanceof VElement) {
            this.children.push(child);
        } else if (typeof child === 'string') {
            this.children.push(child);
        } else {
            throw new Error('Children must be an instance of VElement or string');
        }
        return child;
    }

    render() {
        this._el = document.createElement(this.tag);
    
        for (let key in this.props) {
            const actualProp = forbiddenPropsReverseMappping[key] || key;
            this._el.setAttribute(actualProp, this.props[key]);
        }
    
        this.children.forEach(child => {
            if (child instanceof VElement) {
                this._el.appendChild(child.render());
            } else {
                this._el.appendChild(document.createTextNode(child));
            }
        });
    
        return this._el;
    }
    addDummyChilds(childNum, childTag) {
        for (let i = 0; i < childNum; i++) {
            const props = { 
                id: `${childTag}${i}`,
                color: 'black'

            };
            this.addChildren(new VElement(childTag, { id: `${childTag}${i}` }, ['dummy-original']));
        }
    }
    recursiveDeepClone() {
        const clonedElement = new VElement(this.tag, { ...this.props }, [], this._el);
        this.children.forEach(child => {
            if (child instanceof VElement) {
                clonedElement.addChildren(child.recursiveDeepClone());
            } else {
                clonedElement.addChildren(child);
            }
        });
        return clonedElement;
    }
    modifyRandomChilds(numberOfChilds) {
        if (this.children.length < numberOfChilds) {
            console.error('Number of childs is greater than the number of childs in the parent element.');
            return;
        }
        const randomIndexes = getUniqueRandomArray(0, this.children.length - 1, numberOfChilds);
        for (let i = 0; i < randomIndexes.length; i++) {
            const randomIndex = randomIndexes[i];
            const randomModifierColor = getUniqueRandomNumber(0, 4);

            if (this.children[randomIndex] instanceof VElement) {
                this.children[randomIndex].props.style = `color: ${colors[randomModifierColor]};`;
                this.children[randomIndex].children[0] = `${this.children[randomIndex].children[0]} - ${colors[randomModifierColor]}`;
                this.children[randomIndex].props = {
                    ...this.children[randomIndex].props, id: `${this.children[randomIndex].props.id}-modified` 
                };
            }
        }
    }
    renderDiff(newVDom) {
        try {
            // 1. Compare the tags
            if (this.tag !== newVDom.tag) {
                this._el.replaceWith(newVDom.render());
                this.tag = newVDom.tag;
                this.props = newVDom.props;
                this.children = newVDom.children;
                return;
            }
    
            // 2. Compare props
            const oldProps = this.props;
            const newProps = newVDom.props;
    
            // 2.1 Update or add new attributes
            for (let key in newProps) {
                const actualProp = forbiddenPropsReverseMappping[key] || key;
                if (oldProps[actualProp] !== newProps[key]) {
                    this._el.setAttribute(actualProp, newProps[key]);
                }
            }
    
            // 2.2 Remove old attributes that are no longer present
            for (let key in oldProps) {
                const actualProp = forbiddenPropsReverseMappping[key] || key;
                if (!(key in newProps)) {
                    this._el.removeAttribute(actualProp);
                }
            }

            this.props = newProps;
    
            // 3. Compare children (text content and sub-elements)
            const oldChildren = this.children;
            const newChildren = newVDom.children;
    
            const maxLength = Math.max(oldChildren.length, newChildren.length);
            for (let i = 0; i < maxLength; i++) {
                const oldChild = oldChildren[i];
                const newChild = newChildren[i];
    
                if (newChild === undefined) {
                    // 3.1 Extra child in old VDOM, remove it
                    this._el.removeChild(this._el.childNodes[i]);
                    this.children.splice(i, 1);
                } else if (oldChild === undefined) {
                    // 3.2 Extra child in new VDOM, append it
                    this._el.appendChild(newChild.render());
                    this.children.splice(i, 0, newChild);
                } else if (typeof oldChild === 'string' && typeof newChild === 'string') {
                    // 3.3 Compare text nodes
                    if (oldChild !== newChild) {
                        this._el.childNodes[i].textContent = newChild;
                        this.children[i] = newChild;
                    }
                } else if (oldChild instanceof VElement && newChild instanceof VElement) {
                    // 3.4 Both are VElements, recurse on children
                    oldChild.renderDiff(newChild);
                } else {
                    // 3.5 Replace the node if they are of different types (text vs. VElement)
                    this._el.replaceChild(newChild.render(), this._el.childNodes[i]);
                    this.children[i] = newChild;
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}
const getUniqueRandomArray = (from, to, count) => {
    const array = [];
    while (array.length < count) {
        const random = Math.floor(Math.random() * (to - from + 1)) + from;
        if (!array.includes(random)) {
            array.push(random);
        }
    }
    return array;
}
const generateChilds = () => {
    const currentVDom = new VElement('div', { id: 'app' });

    currentVDom.addChildren(new VElement('h1', {}, ['Hello, World!']));
    const virtualUl = currentVDom.addChildren(new VElement('ul'));
    virtualUl.addDummyChilds(10000, 'li');

    return currentVDom;
}
const callFnPerformanceLogging = (func, label) => {
    const start = performance.now();
    const response = func();
    const end = performance.now();
    console.log(`Execution time of function ${label}: ${end - start} ms`);
    return response;
}

const getExecutionTime = (func) => {
    const start = performance.now();
    func();
    const end = performance.now();
    return end - start;
}

const writeToDom = ( VDom ) => {
    const root = document.getElementById('root');
    root.innerHTML = '';
    root.appendChild(callFnPerformanceLogging(() => VDom.render(), 'VElement.render()'));
}

const getRenderDiffPerformance = (numberOfModifiedChilds) => {
    const timePerformanceArray = [];
    for (let i = 0; i < numberOfModifiedChilds.length; i++) {
        const numberOfChilds = numberOfModifiedChilds[i];
        const newVDom = generateChilds();
        newVDom.render();
        const oldVDom = newVDom.recursiveDeepClone();
        newVDom.children[1].modifyRandomChilds(numberOfChilds);
        timePerformanceArray.push(getExecutionTime(() => oldVDom.renderDiff(newVDom)));
    }
    return timePerformanceArray;
}


const getRenderPerformance = (numberOfChilds) => {
    const timePerformanceArray = [];
    for (let i = 0; i < numberOfChilds.length; i++) {
        const numberOfChildsValue = numberOfChilds[i];
        const newVDom = generateChilds();
        newVDom.render();
        newVDom.children[1].modifyRandomChilds(numberOfChildsValue);
        timePerformanceArray.push(getExecutionTime(() => newVDom.render()));
    }
    return timePerformanceArray;
}
const averageArrays = (arrays) => {
    const length = arrays[0].length;
    const sumArray = new Array(length).fill(0);

    // Sum the corresponding elements of all arrays
    arrays.forEach(array => {
        for (let i = 0; i < length; i++) {
            sumArray[i] += array[i];
        }
    });

    // Calculate the average by dividing each sum by the number of runs
    return sumArray.map(sum => sum / arrays.length);
};


const initVDom = () => {
    const newVDom = generateChilds();
    writeToDom(newVDom);

    const oldVDom = newVDom.recursiveDeepClone();

    newVDom.children[1].modifyRandomChilds(100);

    callFnPerformanceLogging(() => oldVDom.renderDiff(newVDom), 'VElement.renderDiff() with 100 modified childs');
  
    const numberOfModifiedChilds = [10, 20, 50, 100, 300, 500, 1000, 3000, 5000, 9000];

    const testRuns = 10;
    let renderPerformanceResults = [];
    let diffPerformanceResults = [];


    for (let i = 0; i < testRuns; i++) {
        // console.log(`Running test ${i + 1}...`);

        // Run the getRenderPerformance and getRenderDiffPerformance functions
        renderPerformanceResults.push(getRenderPerformance(numberOfModifiedChilds));
        diffPerformanceResults.push(getRenderDiffPerformance(numberOfModifiedChilds));
    }

    // Calculate the average values for both performance arrays
    const avgRenderPerformanceArray = averageArrays(renderPerformanceResults);
    const avgDiffPerformanceArray = averageArrays(diffPerformanceResults);

    console.log("Average render performance array:", avgRenderPerformanceArray);
    console.log("Average diff performance array:", avgDiffPerformanceArray);
};

const colors = ['red', 'green', 'blue', 'grey', 'purple'];

const forbiddenProps = [
    "class",
    "for",
    "onclick",
    "onchange",
    "oninput",
    "tabindex",
    "readonly",
    "maxlength",
    "colspan",
    "rowspan",
    "enctype",
    "autofocus",
    "spellcheck",
    "srcset",
    "novalidate"
];
const forbiddenPropsMappping = {
    "class": "className",
    "for": "htmlFor",
    "onclick": "onClick",
    "onchange": "onChange",
    "oninput": "onInput",
    "tabindex": "tabIndex",
    "readonly": "readOnly",
    "maxlength": "maxLength",
    "colspan": "colSpan",
    "rowspan": "rowSpan",
    "enctype": "encType",
    "autofocus": "autoFocus",
    "spellcheck": "spellCheck",
    "srcset": "srcSet",
    "novalidate": "noValidate"
};
const forbiddenPropsReverseMappping = {
    "className": "class",
    "htmlFor": "for",
    "onClick": "onclick",
    "onChange": "onchange",
    "onInput": "oninput",
    "tabIndex": "tabindex",
    "readOnly": "readonly",
    "maxLength": "maxlength",
    "colSpan": "colspan",
    "rowSpan": "rowspan",
    "encType": "enctype",
    "autoFocus": "autofocus",
    "spellCheck": "spellcheck",
    "srcSet": "srcset",
    "noValidate": "novalidate"
};

