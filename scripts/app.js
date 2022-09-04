function calcInterest(sum, r, n, t, yearPeriod, sumNew) {
    let results = []
    let replenishment = 0
    let percent
    let percenthistory = 0
    let prevResult = sum
    for (let i = 0; i < n; i++) {
        for (let i = 0; i < t; i++) {
            replenishment += Math.round(sumNew * yearPeriod)
            percent = Math.round(((sumNew * yearPeriod) + prevResult) * r)
            percenthistory += percent
            prevResult = Math.round(prevResult + (sumNew * yearPeriod) + percent)
            results.push({totalsum: prevResult, replenishment: replenishment, percent: percenthistory})
        }
    }
    return results
}

    //GET ELEMENTS


$("#buttonCalc").on("click", e => {
    const sumCalcVal = parseInt($("#sumCalc").val() || 0),
        sumAddVal = parseInt($("#sumAdd").val() || 0),
        selectPeriodVal = parseInt($("#selectPeriod").val() || 0),
        procent = parseInt($("#procent").val() || 0),
        selectPeriod = parseInt($("#selectPeriod1").val() || 0),
        colvoYear = parseInt($("#colvoYear").val() || 0)
    let result = calcInterest(sumCalcVal,
        procent / 100,
        selectPeriod,
        colvoYear,
        selectPeriodVal,
        sumAddVal)
    if (result.length != 0) {
        const data = createData(sumCalcVal,
            procent / 100,
            selectPeriod,
            colvoYear,
            selectPeriodVal,
            sumAddVal, 
            result)
        createChart(data, ['#4f4f4f', '#743ee2', '#743122'])
        $("#result").text(result[result.length-1].totalsum)
    } else {
        $("#result").text(0)
    }
})


function createData(sumCalcVal,
    procent,
    selectPeriod,
    colvoYear,
    selectPeriodVal,
    sumAddVal,
    result) {
    let labels = []
    let values1 = []
    let values2 = []
    let values3 = []
    let i2

    for (let i = 1; i <= colvoYear; i++) {
        i2 = (result.length / colvoYear) * i
        labels.push(`${i} год`)
        values1.push(sumCalcVal)
        values2.push(result[i2-1].replenishment)
        values3.push(result[i2-1].percent)
    }
    return {
        labels: labels,
        datasets: [
            {
                name: "Перв. сумма", chartType: "bar",
                values: values1
            },
            {
                name: "Пополнения", chartType: "bar",
                values: values2
            },
            {
                name: "Проценты", chartType: "bar",
                values: values3
            }
        ]
    }
}


function createChart(data, colors) {
    const chart = new frappe.Chart("#graph", {
        title: "График",
        data: data,
        valuesOverPoints: true,
        type: 'bar',
        barOptions: {
            stacked: 1,
            spaceRatio: 0.2
        },
        height: 450,
        colors: colors
    })
    return chart
}


const chart = createChart(createData(10000,
    0.1,
    1,
    10,
    1,
    1000,
    calcInterest(10000,
        0.1,
        1,
        10,
        1,
        1000
        )), ['#4f4f4f', '#743ee2', '#743122'])

setInterval(() => {
    let data1 = document.querySelector(".dataset-units.dataset-bars.dataset-0").querySelectorAll(".data-point-value")
    let data2 = document.querySelector(".dataset-units.dataset-bars.dataset-1").querySelectorAll(".data-point-value")
    for (const data of data1) {
        data.remove()
    }
    for (const data of data2) {
        data.remove()
    }
}, 50)