import teslaoutline from "./images/tesla_outline.svg"
import computeroutline from "./images/laptop_outline.svg"
import foodoutline from "./images/food_art.svg"
import appsoutline from "./images/apps_art.svg"
import fashionoutline from "./images/lv_bag_outline.svg"
import videogamesoutline from "./images/xbox_controller.svg"
import { useNavigate } from "react-router-dom"

  
function GridLayout(){
return (
    <div style={{display: "inline-grid", gridTemplateColumns: "auto auto auto"}}>
        <GridItem imageUrl={teslaoutline} title={"Cars"}/>
        <GridItem imageUrl={computeroutline} title={"Computers"}/>
        <GridItem imageUrl={foodoutline} title={"Food"}/>
        <GridItem imageUrl={appsoutline} title={"Apps"}/>
        <GridItem imageUrl={fashionoutline} title={"Fashion"}/>
        <GridItem imageUrl={videogamesoutline} title={"Video Games"}/>
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
