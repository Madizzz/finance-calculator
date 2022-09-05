// function calcInterest(sum, r, n, t, yearPeriod, sumNew) {
//     let results = []
//     let replenishment = 0
//     let percent
//     let percenthistory = 0
//     let prevResult = sum
//     for (let i = 0; i < n; i++) {
//         for (let i = 0; i < t; i++) {
//             replenishment += Math.round(sumNew * yearPeriod)
//             percent = Math.round(((sumNew * yearPeriod) + prevResult) * r)
//             percenthistory += percent
//             prevResult = Math.round(prevResult + (sumNew * yearPeriod) + percent)
//             results.push({totalsum: prevResult, replenishment: replenishment, percent: percenthistory})
//         }
//     }
//     return results
// }
function calcInterest(sum, percent, percent_ticks, years, replen_ticks, replen) {
    years *= 12
    output = []
    let percentH = 0,
        replenH = 0
    for (let i = 1; i <= years; i++) {
        if (i % replen_ticks == 0) {
            replenH += replen
            sum += replen
        }
        if (i % percent_ticks == 0) {
            percentH += (sum * percent)
            sum += (sum * percent)
        }
        output.push({ totalsum: Math.round(sum), replenishment: replenH, percent: Math.round(percentH) })
    }
    return output
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
        createChart(data, ['#84a3a6', '#bdc7ed', '#bcedc1'])
        const valetSelectVal = $("#valetSelect").val()
        $("#result").text(result[result.length - 1].totalsum.toLocaleString() + " " + valetSelectVal)

    } else {
        $("#result").text(0)
    }
})

$("#buttonCalc").on("click", e => {
    const sumCalcVal = parseInt($("#sumCalc").val() || 0),
        sumAddVal = parseInt($("#sumAdd").val() || 0),
        selectPeriodVal = parseInt($("#selectPeriod").val() || 0),
        procent = parseInt($("#procent").val() || 0),
        selectPeriod = parseInt($("#selectPeriod1").val() || 0),
        colvoYear = parseInt($("#colvoYear").val() || 0),
        replenishment = parseInt($("#replenishment").val() || 0),
        percent = parseInt($("#percent").val() || 0)
    let result = calcInterest(sumCalcVal,
        procent / 100,
        selectPeriod,
        colvoYear,
        selectPeriodVal,
        sumAddVal,
        percent,
        replenishment)
    let resultTable = []
    console.log(result)
    let sumAdd = sumCalcVal, sumProcent = result[12].percent
    for (let i = 1; i <= colvoYear; i++) {

        i2 = (result.length / colvoYear) * i
        let newArray = []

        newArray.push(`${i} год`)
        newArray.push(result[i2 - 2].totalsum)
        newArray.push(sumCalcVal)

        sumAdd = sumAdd + sumCalcVal
        newArray.push(sumAdd)
        newArray.push(result[i2 - 1].percent)
        sumProcent = sumProcent + result[i2 - 1].percent
        newArray.push(sumProcent)

        newArray.push(result[i2 - 1].totalsum)

        resultTable.push(newArray)
    }
    new GenerateTable(document.querySelector("#table"), {
        column: resultTable,
        rows: ["Год", "Начальный баланс", "Пополнено за год", "Суммарные пополнения", "Начисленные проценты", "Суммарный процент", "Итоговый баланс"]

    })
    if (result.length != 0) {
        const data = createData(sumCalcVal,
            procent / 100,
            selectPeriod,
            colvoYear,
            selectPeriodVal,
            sumAddVal,
            result,
            percent,
            replenishment)
        createChart(data, ['#84a3a6', '#bdc7ed', '#bcedc1'])
        const valetSelectVal = $("#valetSelect").val()
        $("#result1").text(result[result.length - 1].totalsum.toLocaleString() + " " + valetSelectVal)
        $("#replenishment").text(result[result.length - 1].replenishment.toLocaleString() + " " + valetSelectVal)
        $("#percent").text(result[result.length - 1].percent.toLocaleString() + " " + valetSelectVal)

    } else {
        $("#result1").text(0)
        $("#replenishment").text(0)
        $("#percent").text(0)
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
        values2.push(result[i2 - 1].replenishment)
        values3.push(result[i2 - 1].percent)
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
    10,
    10,
    1,
    1000,
    calcInterest(10000,
        0.1,
        10,
        10,
        1,
        1000
    )), ['#8a88a6', '#c4c2ed', '#edd1bc'])

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



$("#resetButton").on("click", e => {
    $("#sumCalc").val("0")
    $("#sumAdd").val("0")
    $("#selectPeriod").val("1")
    $("#procent").val("0")
    $("#selectPeriod1").val("1")
    $("#colvoYear").val("0")

    location.reload(true);

})
class GenerateTable {
    constructor(containerElem, data) {
        this.containerElem = containerElem
        this.data = data
        this.generaTable()
    }

    generaTable() {

        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");
        const tblHead = document.createElement("thead");
        const row = document.createElement("tr");
        for (let i = 0; i < this.data.rows.length; i++) {

            const cell = document.createElement("td");
            const cellText = document.createTextNode(this.data.rows[i]);
            cell.appendChild(cellText);
            row.appendChild(cell);

            // add the row to the end of the table body

        }
        tblHead.appendChild(row);
        // creating all cells

        for (let i = 0; i < this.data.column.length; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < this.data.column[i].length; j++) {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(this.data.column[i][j]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }

            // add the row to the end of the table body
            tblBody.appendChild(row);
        }

        tbl.appendChild(tblHead)
        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        this.containerElem.appendChild(tbl);

    }

}
