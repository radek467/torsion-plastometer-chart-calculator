import React from 'react'
import '../styles/mainPage.css'

function Button(props) {
    return (
        <button onClick = {props.clickAction}>{props.title}</button>
    )
}

export default Button;