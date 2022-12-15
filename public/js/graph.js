const canvasChartTop10 = document.getElementById('canvas-chart-top10');
const buttonShow = document.getElementById('button-show');
const selectBook = document.getElementById('select-book');
const getGraphTop10Data = async (bookNum) => {
    const promise = await fetch("/api/graph?" + "bookNum=" + bookNum);
    const data = await promise.json();

    console.log(data);

    return data;
};
const createGraph = async (bookNum) => {
    const data = await getGraphTop10Data(bookNum);
    generateGraph(data);
}
const drawEllipse = (ctx, x, y, w, h) => {
    let kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}
const generateGraph = (data) => {
    console.log(canvasChartTop10.height);
    let ctx = canvasChartTop10.getContext("2d");
    console.log(canvasChartTop10.width);
    ctx.clearRect(0, 0, canvasChartTop10.width, canvasChartTop10.height);
    let counter = 1;
    data.forEach(val => {
        //source ellipse
        drawEllipse(ctx, 5, (counter * 50) - 20, 150, 30);
        //source text
        ctx.font = "8pt Arial";
        ctx.fillText(val['source'], 40, counter * 50);
        //draw line
        ctx.beginPath();
        ctx.moveTo(150, counter * 50);
        ctx.lineTo(300, counter * 50);
        ctx.stroke();
        // weight text
        //source text
        ctx.font = "8pt Arial";
        ctx.fillText(val['weight'], 240, (counter * 50) - 10);
        //target ellipse
        drawEllipse(ctx, 300, (counter * 50) - 20, 150, 30);
        //target text
        ctx.font = "8pt Arial";
        ctx.fillText(val['target'], 340, counter * 50);


        counter++;

    });

}
let bookNum = selectBook.value;
createGraph(bookNum);