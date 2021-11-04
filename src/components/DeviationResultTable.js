import React, {useState} from 'react';

const DeviationResultTable = ({leftChartDeviations, rightChartDeviations}) => {
    let resultTable = "";
    // for(let i = 0; i < leftChartDeviations.length; i++ ) {
    //     resultTable = resultTable.concat(
    //         <tr>
    //             <th></th>
    //         </tr>
    //     )
    // }

    // resultTable = resultTable.concat(
    // `<tr>
    //     <td><input type="number" step="0.001" value="5"></td>
    // </tr>`)


    resultTable = leftChartDeviations.map((element, index) => {
        return (
            <tr>
                <td>{index}</td>
                <td><input type="number" step="0.001" value={element}/></td>
                <td><input type="number" step="0.001" value={rightChartDeviations[index]}/></td>
            </tr>
        )
    })

    // console.log(leftChartDeviations)
    return (
        <div>
            <table style = {{width: "150px"}}>
            {resultTable}
            </table>
        </div>
    )   
}

export default DeviationResultTable