import teslaoutline from "./images/tesla_outline.svg"
import computeroutline from "./images/laptop_art.png"
import foodoutline from "./images/food_art.svg"
import appsoutline from "./images/apps_art.svg"
import { useNavigate } from "react-router-dom"

  
function GridLayout(){


    return (
    <div style={{display: "inline-grid", gridTemplateColumns: "auto auto auto"}}>
        <GridItem imageUrl={teslaoutline} title={"Cars"}/>
        <GridItem imageUrl={computeroutline} title={"Computers"}/>
        <GridItem imageUrl={foodoutline} title={"Food"}/>
        <GridItem imageUrl={appsoutline} title={"Apps"}/>
        <GridItem imageUrl={teslaoutline} title={"Clothes"}/>
        <GridItem imageUrl={teslaoutline} title={"Video Games"}/>
    </div>)
}

interface GridItemProps{
    imageUrl: string
    title: string
}
const GridItem = (props: GridItemProps) =>{
    const navigate = useNavigate();

    return (
    <div className="item_style" onClick={()=> {  navigate("/items/" + props.title.replaceAll(" ", "_"))} } >
        <img src={props.imageUrl} style={{height: "100pt", marginInline: "6pt", marginTop: "24pt"}}></img>
        <h3 style={{marginTop: "auto", marginBottom: "12pt", alignSelf: "center", color: "white", fontFamily: "Futura", textDecoration: "underline"}}>{props.title}</h3>
    </div>)
}
export default GridLayout
