import {Route, Routes} from "react-router-dom";
import {Navbar} from './components/Navbar';
import StartPage from "./pages/StartPage";
import {SavedCharts} from "./pages/SavedCharts";
import {ProcessImage} from "./pages/ProcessImage";


function App() {
    return (
        <div className="App">
            <Navbar/>
            <div className="content">
                <Routes>
                    <Route exact path="/" element={<StartPage/>}/>
                    <Route exact path="/getCharts" element={<SavedCharts/>}/>
                    <Route exact path="/processImage" element={<ProcessImage/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;
