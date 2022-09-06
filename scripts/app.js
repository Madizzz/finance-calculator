function calcInterest(sum, percent, percent_ticks, years, replen_ticks, replen) {
    years *= 12
    output = []
    let percentH = 0,
        replenH = 0
    for (let i = 1; i <= years; i++) {
        let prevReplenH = (output[i-13] || {replenishment: 0}).replenishment,
            prevPercenH = (output[i-13] || {percent: 0}).percent
        if (i % replen_ticks == 0) {
            replenH += replen
            sum += replen
        }
        if (i % percent_ticks == 0) {
            percentH += (sum * percent)
            sum += (sum * percent)
        }
        output.push({ totalsum: Math.round((sum + Number.EPSILON) * 100) / 100, replenishment: replenH, percent: Math.round((percentH + Number.EPSILON) * 100) / 100, replDif: replenH - prevReplenH, percDif: Math.round(((percentH - prevPercenH) + Number.EPSILON) * 100) / 100 })
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
        console.log(result)
        const valetSelectVal = $("#valetSelect").val()
        createTable(createDataTable(result, colvoYear), sumCalcVal, valetSelectVal)
        $("#result").text(result[result.length - 1].totalsum.toLocaleString() + ` ${valetSelectVal}`)
        $("#result1").text(result[result.length - 1].totalsum.toLocaleString() + ` ${valetSelectVal}`)
        $("#replenishment").text(result[result.length - 1].replenishment.toLocaleString() + ` ${valetSelectVal}`)
        $("#percent").text(result[result.length - 1].percent.toLocaleString() + ` ${valetSelectVal}`)

    } else {
        $("#result").text(0)
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
    let labels = [],
        values1 = [],
        values2 = [],
        values3 = [],
        i2

    for (let i = 1; i <= colvoYear; i++) {
        i2 = (result.length / colvoYear) * i
        labels.push(`${i}`)
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

function createDataTable(result, colvoYear) {
    let labels = [],
        values1 = [],
        values2 = [],
        values3 = [],
        values4 = [],
        values5 = [],
        i2

    for (let i = 1; i <= colvoYear; i++) {
        i2 = (result.length / colvoYear) * i
        labels.push(`${i}`)
        values1.push(result[i2 - 1].totalsum)
        values2.push(result[i2 - 1].replenishment)
        values3.push(result[i2 - 1].percent)
        values4.push(result[i2 - 1].percDif)
        values5.push(result[i2 - 1].replDif)
    }
    return {
        labels: labels,
        values1: values1,
        values2: values2,
        values3: values3,
        values4: values4,
        values5: values5
    }
                
}

function createChart(data, colors) {
    const chart = new frappe.Chart("#graph", {
        title: "График",
        data: data,
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


function createTable (edata, sumCalcVal, valetSelectVal) {
    let container = document.querySelector("#table")
    data = [
        ["Год", "Начальная сумма", "Пополнение за год", "Суммарные пополнения", "Начисленные проценты за год", "Суммарный процент" , "Итоговая сумма"]
    ]
    for (let i = 0; i < edata.labels.length; i++) {
        data.push([
            edata.labels[i],
            (edata.values1[i-1] || sumCalcVal).toLocaleString() + ` ${valetSelectVal}`,
            edata.values5[i].toLocaleString() + ` ${valetSelectVal}`,
            edata.values2[i].toLocaleString() + ` ${valetSelectVal}`,
            edata.values4[i].toLocaleString() + ` ${valetSelectVal}`,
            edata.values3[i].toLocaleString() + ` ${valetSelectVal}`,
            edata.values1[i].toLocaleString() + ` ${valetSelectVal}`
        ])
    }
    if (container.classList.contains("handsontable")) {
        let parent = container.parentElement,
            div = document.createElement("div")
        parent.replaceChild(div, container)
        div.id = "table"
        div.classList.add("uk-table")
        container = div
    }
    const table = new Handsontable(container, {
        data,
        height: 'auto',
        width: '95vw',
        columns: [{className: "row"}, {className: "row"}, {className: "row"}, {className: "row"}, {className: "row"}, {className: "row"}, {className: "row"}],
        colHeaders: false,
        licenseKey: 'non-commercial-and-evaluation'
      })

    let trs = container.querySelectorAll("tr")
    trs[0].id = "special-above"
    trs[trs.length-1].id = "special-below"

    // let tds = container.querySelectorAll("td")
    // tds[tds.length-1].classList.add("total-cell")
    // console.log(tds)
    return table
}


$("#resetButton").on("click", e => {
    $("#sumCalc").val("0")
    $("#sumAdd").val("0")
    $("#selectPeriod").val("1")
    $("#procent").val("0")
    $("#selectPeriod1").val("1")
    $("#colvoYear").val("0")

    location.reload(true);

})

// class GenerateTable {
//     constructor(containerElem, data) {
//         this.containerElem = containerElem
//         this.data = data
//         this.generaTable()
//     }

//     generaTable() {

//         const tbl = document.createElement("table");
//         const tblBody = document.createElement("tbody");
//         const tblHead = document.createElement("thead");
//         const row = document.createElement("tr");
//         for (let i = 0; i < this.data.rows.length; i++) {

//             const cell = document.createElement("td");
//             const cellText = document.createTextNode(this.data.rows[i]);
//             cell.appendChild(cellText);
//             row.appendChild(cell);

//             // add the row to the end of the table body

//         }
//         tblHead.appendChild(row);
//         // creating all cells

//         for (let i = 0; i < this.data.column.length; i++) {
//             const row = document.createElement("tr");

//             for (let j = 0; j < this.data.column[i].length; j++) {
//                 const cell = document.createElement("td");
//                 const cellText = document.createTextNode(this.data.column[i][j]);
//                 cell.appendChild(cellText);
//                 row.appendChild(cell);
//             }

//             // add the row to the end of the table body
//             tblBody.appendChild(row);
//         }

//         tbl.appendChild(tblHead)
//         // put the <tbody> in the <table>
//         tbl.appendChild(tblBody);
//         // appends <table> into <body>
//         this.containerElem.appendChild(tbl);

//     }

// }
