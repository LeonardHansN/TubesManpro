const canvasChartTop10 = document.getElementById('canvas-chart-top10');
const buttonShow = document.getElementById('button-show');
const selectBook = document.getElementById('select-book');
const getGraphTop10Data = async (bookNum) => {
    const promise = await fetch("/top10char?" + "bookNum=" + bookNum);
    const data = await promise.json();

    console.log(data);

    return data;
};
const createGraph = async (bookNum) => {
    const data = await getGraphTop10Data(bookNum);
    generateGraph(data);
}
const generateGraph = (data) => {

    let ctx = canvasChartTop10.getContext("2d");
    let x = canvasChartTop10.width / 2;
    console.log(canvasChartTop10.width);
    ctx.clearRect(0, 0, canvasChartTop10.width, canvasChartTop10.height);

    ctx.beginPath();
    ctx.arc(x, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "10pt Arial";
    ctx.fillText("Hello World", 10, 50);

}
buttonShow.addEventListener("click", () => {
    let bookNum = selectBook.value;
    createGraph(bookNum);
});