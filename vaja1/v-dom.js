class VElement {
    constructor(tag, props = {}, children = []) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }

    addChildren(child) {
        if (child instanceof VElement) {
            this.children.push(child);
        } else if (typeof child === 'string') {
            this.children.push(child);
        } else {
            throw new Error('Children must be an instance of VElement or string');
        }
        return this;
    }

    render() {
        const element = document.createElement(this.tag);

        for (let key in this.props) {
            element.setAttribute(key, this.props[key]);
        }

        this.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child.render());
            }
        });

        return element;
    }
}

const initVDom = () => {
    const vDom = new VElement('div', { id: 'app' });

    // Append the rendered virtual DOM to the real DOM
    const rootElement = document.getElementById('root');
    rootElement.appendChild(vDom.render());
};
