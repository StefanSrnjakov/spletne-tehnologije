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
    root.appendChild(VDom.render());
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


// **** function used for performance logging ****
const averageArrays = (arrays) => {
    const length = arrays[0].length;
    const sumArray = new Array(length).fill(0);

    arrays.forEach(array => {
        for (let i = 0; i < length; i++) {
            sumArray[i] += array[i];
        }
    });
    return sumArray.map(sum => sum / arrays.length);
};

// **** main function ****
const initVDom = () => {
    const newVDom = generateChilds();
    writeToDom(newVDom);

    const oldVDom = newVDom.recursiveDeepClone();

    newVDom.children[1].modifyRandomChilds(100);

    oldVDom.renderDiff(newVDom);
  
    // *************************************************************************************
    // ***** Comment is added to avoid running the performance tests on every page load *****
    // *************************************************************************************


    // const numberOfModifiedChilds = [10, 20, 50, 100, 300, 500, 1000, 3000, 5000, 9000];

    // const testRuns = 10;
    // let renderPerformanceResults = [];
    // let diffPerformanceResults = [];

    // for (let i = 0; i < testRuns; i++) {
    //     renderPerformanceResults.push(getRenderPerformance(numberOfModifiedChilds));
    //     diffPerformanceResults.push(getRenderDiffPerformance(numberOfModifiedChilds));
    // }

    // const avgRenderPerformanceArray = averageArrays(renderPerformanceResults);
    // const avgDiffPerformanceArray = averageArrays(diffPerformanceResults);

    // console.log("Average render performance array:", avgRenderPerformanceArray);
    // console.log("Average diff performance array:", avgDiffPerformanceArray);
};
