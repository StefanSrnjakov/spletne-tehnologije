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
    logRenderPerfomance() { }
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
            // Check if the key exists in the reverse mapping
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
            this.addChildren(new VElement(childTag, { id: `${childTag}${i}` }, ['dummy']));
        }
    }
    logRenderPerfomance() {
        const start = performance.now();
        const response = this.render();
        const end = performance.now();
        console.log(`Execution time for <${this.tag} id="${this.props.id}">..: ${end - start} ms`);
        return response;
    }
    recursiveDeepClone() {
        const clonedElement = new VElement(this.tag, { ...this.props }, [], this._el);
        if (this._el){
        }
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
        // Step 1: Compare the tags
        try {
            if (this.tag !== newVDom.tag) {
                this._el.replaceWith(newVDom.render());
                return;
            }
    
            // Step 2: Compare the props (attributes)
            const oldProps = this.props;
            const newProps = newVDom.props;
    
            // Update or add new attributes
            for (let key in newProps) {
                const actualProp = forbiddenPropsReverseMappping[key] || key;
                if (oldProps[actualProp] !== newProps[key]) {
                    this._el.setAttribute(actualProp, newProps[key]);
                }
            }
    
            // Remove old attributes that are no longer present
            for (let key in oldProps) {
                const actualProp = forbiddenPropsReverseMappping[key] || key;
                if (!(key in newProps)) {
                    this._el.removeAttribute(actualProp);
                }
            }
    
            // Step 3: Compare children (text content and sub-elements)
            const oldChildren = this.children;
            const newChildren = newVDom.children;
    
            const maxLength = Math.max(oldChildren.length, newChildren.length);
            for (let i = 0; i < maxLength; i++) {
                const oldChild = oldChildren[i];
                const newChild = newChildren[i];
    
                if (newChild === undefined) {
                    // Extra child in old VDOM, remove it
                    this._el.removeChild(this._el.childNodes[i]);
                } else if (oldChild === undefined) {
                    // Extra child in new VDOM, append it
                    this._el.appendChild(newChild.render());
                } else if (typeof oldChild === 'string' && typeof newChild === 'string') {
                    // Compare text nodes
                    if (oldChild !== newChild) {
                        this._el.childNodes[i].textContent = newChild;
                    }
                } else if (oldChild instanceof VElement && newChild instanceof VElement) {
                    // Both are VElements, recurse on children
                    oldChild.renderDiff(newChild);
                } else {
                    // Replace the node if they are of different types (text vs. VElement)
                    this._el.replaceChild(newChild.render(), this._el.childNodes[i]);
                }
            }
        } catch (e) {
            console.error(e.message);
            console.error(newVDom);
        }
        
    }
}
const getUniqueRandomNumber = (from, to) => {
    return Math.floor(Math.random() * (to - from + 1)) + from;
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
const executionTime = (func, label) => {
    const start = performance.now();
    const response = func();
    const end = performance.now();
    console.log(`Execution time of function ${label}: ${end - start} ms`);
    return response;
}

const writeToDom = ( VDom ) => {
    const root = document.getElementById('root');
    root.innerHTML = '';
    root.appendChild(executionTime(() => VDom.render(), 'VElement.render()'));
}
const renderDiff = (oldVDom, newVDom) => {
    executionTime(() => oldVDom.renderDiff(newVDom), 'renderDiff()');
}

const initVDom = () => {
    const newVDom = generateChilds();
    writeToDom(newVDom);
    const oldVDom = newVDom.recursiveDeepClone();

    newVDom.children[1].modifyRandomChilds(5000);

    renderDiff(oldVDom, newVDom);
    console.log(oldVDom);
    console.log(newVDom);
};


// TODO smeni a render diff da go menja i stariot objekt.
// uredi go kodot
// istrazi za Node api so e razlikata
// performance da dava output array
// napravi univerzalen react proekt za merenje vreme
// proveri gi us ednas site tocki da vidis dali e se taman



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

