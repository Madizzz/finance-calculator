function calcInterest(sum, r, n, t, yearPeriod, sumNew) {
    let prevResult = sum
    for (let i = 0; i < n; i++) {
        for (let i = 0; i < t; i++) {
            console.log(prevResult)
            prevResult = prevResult + (sumNew * yearPeriod) + (((sumNew * yearPeriod) + prevResult) * r)
        }
    }
    return prevResult
}

$(document).ready(function () {
    //GET ELEMENTS


    $("#buttonCalc").click(e => {
        const sumCalcVal = $("#sumCalc").val(),
            sumAddVal = $("#sumAdd").val(),
            selectPeriodVal = $("#selectPeriod").val(),
            procent = $("#procent").val(),
            selectPeriod = $("#selectPeriod1").val(),
            colvoYear = $("#colvoYear").val()
        console.log(selectPeriodVal)

        console.log(parseInt(sumCalcVal),
            parseInt(procent) / 100,
            parseInt(selectPeriod),
            parseInt(colvoYear),
            parseInt(selectPeriod),
            parseInt(sumAddVal))
        let result = calcInterest(parseInt(sumCalcVal),
            parseInt(procent) / 100,
            parseInt(selectPeriod),
            parseInt(colvoYear),
            parseInt(selectPeriodVal),
            parseInt(sumAddVal))
        console.log(result)
        $("#result").text(result)
    })

});