import {React, Component} from 'react'
import Button from '../components/Button'
import Image from '../components//Image'
import '../styles/popup.css'
import '../styles/mainPage.css'


class Popup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: "",
            isVisible: true
        }
       
    }

    loadImage = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                this.setState({
                    image: reader.result
                })
            }
        }
        reader.readAsDataURL(e.target.files[0])
       
    }

    passImage = () => {
        this.closePopup()
        this.props.getImage(this.state.image)
    }

    closePopup = () => {
        this.setState({
            isVisible: false
        })
    }   

    render(){
        return(
            <>
                {this.state.isVisible ? <div className="popup">
                    <div className="overlay">
                    </div>
                    <div className = "popup-content">
                            <input type="file" accept = {"image/png"} onChange = {this.loadImage}></input>
                            <Image title = {"selectedImage"} src = {this.state.image} alt = {"selectedImage"} style = {{maxHeight:"70vh", minWidth: "70%"}}></Image>
                            <br></br>
                            <p>Do you want process this image?</p>
                            <Button title = {"Yes"} clickAction = {this.passImage}></Button>
                            <Button title = {"Close"} clickAction = {this.closePopup}></Button>
                    </div>
                </div> : "" }
            </>
        )
    }
}

export default Popup;