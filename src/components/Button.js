import React from 'react'
import '../styles/mainStyles.css'
const Button = (props) => {
    return (
        <button  className="button" onClick = {props.clickAction} disabled = {props.disabled}>{props.title}</button>
    )
}

export default Button;