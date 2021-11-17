import React from 'react';

import '../styles/calculationDataContent.css'

const DeviationResultTable = ({momentChartDeviations, strengthChartDeviations}) => {
    let resultTable = "";
    if (momentChartDeviations.length !== strengthChartDeviations.length) {
        return (
            <>
                <p className={"error"} style={{color: "red"}}>Calculate chart deviations went wrong</p>
            </>
        )
    }

    resultTable = momentChartDeviations.map((element, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td><input className="table-input" type="number" step="0.1" defaultValue={element.toFixed(3)}
                           onChange={(e) => momentChartDeviations[index] = parseFloat(e.target.value)}/></td>
                <td><input className="table-input" type="number" step="0.1"
                           defaultValue={strengthChartDeviations[index].toFixed(3)}
                           onChange={e => strengthChartDeviations[index] = parseFloat(e.target.value)}/></td>
            </tr>
        )
    })

    return (
        <>
            <table className="table">
                <tbody>
                {resultTable}
                </tbody>
            </table>
        </>
    )
}

export default DeviationResultTable