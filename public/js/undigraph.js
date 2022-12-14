const containerGraph = document.getElementById('container-graph');
const buttonShow = document.getElementById('button-show');
const selectBook = document.getElementById('select-book');
const spanBookNum = document.getElementById('span-booknum');

var graph;
var options = {
    // "physics": {
    //     "barnesHut": {
    //         "springConstant": 0,
    //         "avoidOverlap": 0.2,
    //         'gravitationalConstant': 0
    //     }
    // }
    // configure: {
    //     enabled: true,
    //     filter: 'physics, layout',
    //     showButton: true
    //   }
};

// Funcs
const getGraphData = async (bookNum) => {
    const promise = await fetch("/graph?" + "bookNum=" + bookNum);
    const data = await promise.json();

    console.log(data);

    return data;
};

const makeNetwork = async (bookNum) => {
    const data = await getGraphData(bookNum);
    graph = new vis.Network(containerGraph, data, options);
}

buttonShow.addEventListener("click", () => {
    let bookNum = selectBook.value;
    makeNetwork(bookNum);
});

(() => {

})();

