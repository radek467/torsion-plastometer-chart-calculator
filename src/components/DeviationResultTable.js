import React from 'react';

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
                <td><input type="number" step="0.001" defaultValue={element}
                           onChange={(e) => momentChartDeviations[index] = parseFloat(e.target.value)}/></td>
                <td><input type="number" step="0.001" defaultValue={strengthChartDeviations[index]}
                           onChange={e => strengthChartDeviations[index] = parseFloat(e.target.value)}/></td>
            </tr>
        )
    })

    return (
        <div>
            <table style={{width: "150px"}}>
                {resultTable}
            </table>
        </div>
    )
}

export default DeviationResultTable