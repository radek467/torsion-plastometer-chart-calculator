import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/mainPage.css'

import "../styles/resultPresentation.css"


const ResultPresentation = ({sigma, alternativeDeformations, classNames}) => {
    const tableContent = createTableContent(sigma, alternativeDeformations)

    return (
        <>
            <table className={classNames}>
                <tbody>
                {tableContent}
                </tbody>
            </table>
        </>
    )
}

const createTableContent = (sigma, alternativeDeformations) => {
    const tableContent = [];

    tableContent.push(
        <tr>
            <td className="resultTableCell"><p>L.p</p></td>
            <td className="resultTableCell"><p>Sigma</p></td>
            <td className="resultTableCell">Random</td>
        </tr>
    )
    for(let i = 0; i < sigma.length || i < alternativeDeformations.length; i++) {
        tableContent.push(
            <tr>
                <td className="resultTableCell">{i +1 }</td>
                <td className="resultTableCell">{parseFloat(sigma[i]).toFixed(3)}</td>
                <td className="resultTableCell">{parseFloat(alternativeDeformations[i]).toFixed(3)}</td>
            </tr>
        )
    }
    return tableContent;
}

export default ResultPresentation;