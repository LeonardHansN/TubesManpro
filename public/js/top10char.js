const canvasChartTop10 = document.getElementById('canvas-chart-top10');
const buttonShow = document.getElementById('button-show');
const selectBook = document.getElementById('select-book');
const spanBookNum = document.getElementById('span-booknum');

const chartConfig = {
    type: 'bar',
    data: {
        datasets: [
            {
                backgroundColor: ['#eb4034', '#eb8f34', '#dbeb34', '#89eb34', '#3fb555',
                    '#34ebc3', '#3446eb', '#ab34eb', '#eb34c6', '#eb345f']
            }
        ]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Jumlah Interaksi',
                    font: {
                        size: 18,
                    },
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Karakter',
                    font: {
                        size: 18,
                    },
                },
            }
        },
        elements: {
            bar: {
                // borderWidth: 2,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                font: {
                    size: 24,
                },
            }
        }
    },
};
var top10Chart;



// Funcs

const generateChartTop10 = (data, bookNum) => {
    // Kosongkan chart
    if (top10Chart != null) {
        top10Chart.destroy();
    }

    const datasets = []

    chartConfig['data']['labels'] = data.x;
    datasets.push({ data: data.y });
    chartConfig['data']['datasets'][0]['data'] = data.y;
    // chartConfig['options']['plugins']['title']['text'] = `Top 10 Jumlah Interaksi Karakter dalam Buku ${bookNum}`
    spanBookNum.innerText = bookNum;

    top10Chart = new Chart(canvasChartTop10.getContext("2d"), chartConfig);
}

const getChartTop10Data = async (bookNum) => {
    const promise = await fetch("/top10char?" + "bookNum=" + bookNum);
    const data = await promise.json();

    console.log(data);

    return data;
};

const makeChartTop10 = async (bookNum) => {
    const data = await getChartTop10Data(bookNum);
    generateChartTop10(data, bookNum);
};

buttonShow.addEventListener("click", () => {
    let bookNum = selectBook.value;
    makeChartTop10(bookNum);
});

(()=>{
    makeChartTop10(1);
})();