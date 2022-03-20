
import { useNavigate } from "react-router-dom"
import GridLayout from "./GridLayout"
function Home(){


    return(<div >
            <div style={{display:"flex", justifyContent: "center"}}>
                <h3 style={{color:"white", margin: 0, fontFamily: "Futura", fontStyle: "italic"}}>the coolest stuff on earth</h3>
            </div>
            
            <div style={{display: "flex", justifyContent: "center"}}>
            <GridLayout />
            </div>
        </div>)
}

export default Home