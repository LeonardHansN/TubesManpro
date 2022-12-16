const containerGraph = document.getElementById('container-graph');
const buttonShow = document.getElementById('button-show');
const selectBook = document.getElementById('select-book');
const spanBookNum = document.getElementById('span-booknum');

var graph;
var options = {
    layout: {
        hierarchical: {
            enabled: true,
        },
    },
    configure: {
        enabled: false,
        filter: 'physics, layout',
        showButton: true
    },
    physics: {
        enabled: true,
        hierarchicalRepulsion:{
            centralGravity: 1.2,
            avoidOverlap: 1,
        }
    },
    nodes:{
        font:{
            color: '#000000',
            size: 18
        }
    }
};

const getGraphData = async (bookNum) => {
    const promise = await fetch("/graph?" + "bookNum=" + bookNum);
    const data = await promise.json();

    console.log(data);

    return data;
};

const makeNetwork = async (bookNum) => {
    const data = await getGraphData(bookNum);
    
    spanBookNum.innerText=bookNum;
    graph = new vis.Network(containerGraph, data, options);
}

buttonShow.addEventListener("click", () => {
    let bookNum = selectBook.value;
    makeNetwork(bookNum);
});

(() => {
    makeNetwork(1)
})();

