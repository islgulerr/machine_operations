const size = 100;
const time = [...Array(size).keys()];

const voltList = [];
const rotateList = [];
const pressureList = [];
const vibrationList = [];

const failureList = [];

let lowerLimitVolt = 0;
let upperLimitVolt = 0;

let lowerLimitRotate = 0;
let upperLimitRotate = 0;

let lowerLimitPressure = 0;
let upperLimitPressure = 0;

let lowerLimitVibration = 0;
let upperLimitVibration = 0;

window.onload = async function () {
    await getData();

    const all = createAllChart();
    const failure = createPieChart();

    const volt = createLineChart("volt", voltList, lowerLimitVolt, upperLimitVolt, "rgba(255, 0, 0, 1)");
    const rotate = createLineChart("rotate", rotateList, lowerLimitRotate, upperLimitRotate, "rgba(0, 255, 0, 1)");
    const pressure = createLineChart("pressure", pressureList, lowerLimitPressure, upperLimitPressure, "rgba(0, 0, 255, 1)");
    const vibration = createLineChart("vibration", vibrationList, lowerLimitVibration, upperLimitVibration, "rgba(255, 0, 255, 1)");

    new Chart(document.getElementById("chartFailure").getContext("2d"), failure);
    new Chart(document.getElementById("chartAll").getContext("2d"), all);
    new Chart(document.getElementById("chartVolt").getContext("2d"), volt);
    new Chart(document.getElementById("chartRotate").getContext("2d"), rotate);
    new Chart(document.getElementById("chartPressure").getContext("2d"), pressure);
    new Chart(document.getElementById("chartVibration").getContext("2d"), vibration);
};

async function getData() {
    await fetch('/data')
        .then(function (response) {
            return response.text();
        }).then(function (text) {
            const rows = text.split("\n");
            const limits = rows.slice(0, 2);

            const lower = limits[0].split(",");
            const upper = limits[1].split(",");

            lowerLimitVolt = lower[2];
            upperLimitVolt = upper[2];

            lowerLimitRotate = lower[3];
            upperLimitRotate = upper[3];

            lowerLimitPressure = lower[4];
            upperLimitPressure = upper[4];

            lowerLimitVibration = lower[5];
            upperLimitVibration = upper[5];

            const values = rows.slice(2);
            var instant = [0, 0];

            values.forEach((value) => {
                let subValues = value.split(",");

                voltList.push(subValues[2]);
                rotateList.push(subValues[3]);
                pressureList.push(subValues[4]);
                vibrationList.push(subValues[5]);

                if (subValues[13] === "TRUE") {
                    instant[0] += 1;
                } else {
                    instant[1] += 1;
                }
            });

            failureList.push(instant[0]);
            failureList.push(instant[1]);
        });
}

function createAllChart() {
    return {
        type: "line",
        data: {
            labels: time,
            datasets: [
                {
                    label: "volt",
                    data: voltList,
                    fill: false,
                    borderColor: ["rgba(255, 0, 0, 1)"],
                    backgroundColor: ["rgba(0, 0, 0, 0.1)"],
                },
                {
                    label: "rotate",
                    data: rotateList,
                    fill: false,
                    borderColor: ["rgba(0, 255, 0, 1)"],
                    backgroundColor: ["rgba(0, 0, 0, 0.1)"],
                },
                {
                    label: "pressure",
                    data: pressureList,
                    fill: false,
                    borderColor: ["rgba(0, 0, 255, 1)"],
                    backgroundColor: ["rgba(0, 0, 0, 0.1)"],
                },
                {
                    label: "vibration",
                    data: vibrationList,
                    fill: false,
                    borderColor: ["rgba(255, 0, 255, 1)"],
                    backgroundColor: ["rgba(0, 0, 0, 0.1)"],
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    };
}

function createPieChart() {
    return {
        type: "doughnut",
        data: {
            labels: ["Success", "Fail"],
            datasets: [
                {
                    label: "Failure",
                    data: failureList,
                    backgroundColor: ["rgba(0, 255, 0, 1)", "rgba(255, 0, 0, 1)"],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Failure Chart",
                },
            },
        },
    };
}

function createLineChart(name, data, lowerLimit, upperLimit, color) {
    return {
        type: "line",
        data: {
            labels: time,
            datasets: [
                {
                    label: name,
                    data: data,
                    fill: false,
                    borderColor: [color],
                    backgroundColor: ["rgba(0, 0, 0, 0.1)"],
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    onClick: function () {
                        return false;
                    },
                },
                annotation: {
                    annotations: {
                        lower: {
                            type: "line",
                            yMin: lowerLimit,
                            yMax: lowerLimit,
                            borderColor: "rgb(0, 0, 0)",
                            borderWidth: 2,
                            label: {
                                content: () => "Lower bound: " + lowerLimit,
                                enabled: true,
                            },
                        },
                        upper: {
                            type: "line",
                            yMin: upperLimit,
                            yMax: upperLimit,
                            borderColor: "rgb(0, 0, 0)",
                            borderWidth: 2,
                            label: {
                                content: () => "Upper bound: " + upperLimit,
                                enabled: true,
                            },
                        },
                        back: {
                            type: "box",
                            xMin: 0,
                            xMax: size,
                            yMin: lowerLimit,
                            yMax: upperLimit,
                            backgroundColor: "rgba(250,250,0,0.4)",
                            drawTime: "beforeDatasetsDraw",
                            borderWidth: 1,
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    };
}
