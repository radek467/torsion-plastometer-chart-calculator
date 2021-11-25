import React, {Component} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/mainPage.css'
import image from '../assets/images/foto.png'

import "../styles/resultPresentation.css"


const ResultPresentation = ({sigma, random}) => {
    const tableContent = createTableContent(sigma, random)

    return (
        <>
            <table className="resultTable float-left">
                <tbody>
                {tableContent}
                </tbody>
            </table>
        </>
    )
}

const createTableContent = (sigma, random) => {
    const tableContent = [];

    tableContent.push(
        <tr className="resultTableRow">
            <td className="resultTableCell"><p>L.p</p></td>
            <td className="resultTableCell"><p>Sigma</p></td>
            <td className="resultTableCell">Random</td>
        </tr>
    )

    for(let i = 0; i < sigma.length || i < random.length; i++) {
        tableContent.push(
            <tr className="resultTableRow">
                <td className="resultTableCell">{i +1 }</td>
                <td className="resultTableCell">{parseFloat(sigma[i]).toFixed(3)}</td>
                <td className="resultTableCell">{parseFloat(random[i]).toFixed(3)}</td>
            </tr>
        )
    }
    return tableContent;
}

export default ResultPresentation;