
import axios from "axios"
import likeImage from "./images/thumbup.svg"
import dislikeImage from "./images/thumbdown.svg"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
function Item() {
    const params = useParams();
    const title = params.title as string
    console.log("data test", title)
    const [votingFinished, setVotingFinished] = useState(false)
    
    if (localStorage.getItem(title) !== null){
        setVotingFinished(true)
    }

    const [items, setItems] = useState(()=>{
        var array:ObjectType[] = []
        array.push({id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0})
        return array
    })
    useEffect(()=>{
        if (votingFinished){
            axios.get<ObjectType[]>("/get_new_objects", {headers: {quantity: 7, categories: title}})
            .then((res)=>{
                setItems(res.data)
            })
        }
        else{
            axios.get<ObjectType[]>("/get_top_objects", {headers: {quantity: 10, categories: title}})
            .then((res)=>{
                setItems(res.data)
            })
        }
    }, [votingFinished])





    const ItemCardView = (props: ItemCardViewProps) => {
        const [currentItem, setCurrentItem] = useState(0) 
    
        return(
            <div style={{width: "288pt", height: "360pt", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <h2 style={{color: "white", fontFamily: "Futura"}}>{props.items[currentItem].name}</h2>
                <img src={props.items[currentItem].imageUrl} style={{width: "288pt", height: "auto"}}></img>
                <div style={{display: "flex", justifyContent: "center", marginTop: "auto", marginBottom: "12pt"}}>
                    <img style={{width: "48pt"}} onClick={ ()=>{ upvote(props.items[currentItem].id) } } src={likeImage}></img>
                    <img style={{width: "48pt", marginLeft: "12pt"}} onClick={ ()=>{ downvote(props.items[currentItem].id) } } src={dislikeImage}></img>
                </div>
            </div>)
        
        function upvote(id: string){
            axios.get("/upvote_object", {headers: {objectID: id} })
            .then((res)=>{
                if (currentItem + 1 === items.length){
                    setVotingFinished(true)
                }
                else{
                    setCurrentItem(currentItem + 1)
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    
        function downvote(id: string){
            axios.get("/downvote_object", {headers: {objectID: id} })
            .then((res)=>{
                if (currentItem + 1 === items.length){
                    setVotingFinished(true)
                }
                else{
                    setCurrentItem(currentItem + 1)
                }
            })
            .catch((error)=>{
                console.log(error)
            })
    
        }
    
    }




    var windowContent = <ItemCardView items={items}/>
    if (votingFinished){
        windowContent = <ResultsPage items={items} />
    }
    return(<div style={{display: "flex", justifyContent: 'center'}}>
        {windowContent}
    </div>)




    
}



interface ItemCardViewProps{
    items: ObjectType[]
}

interface ObjectType {
    id: string
    name: string
    description: string
    imageUrl: string
    categories: string[]
    upvotes: number
    downvotes: number
}

interface ResultsPageProps{
    items: ObjectType[]
}

interface ResultItemProps{
    item: ObjectType
}

const ResultItem = (props: ResultItemProps) => {

    var totalVotes: number = props.item.upvotes + props.item.downvotes
    var upvoteShare: number = props.item.upvotes/totalVotes
    const FullBarWidthInPts:number = 432;
    const barWidth:string = (upvoteShare * FullBarWidthInPts) + "pt"
    return(
    <div style={{display: "flex", flexDirection: "row"}}>
        <h3 style={{fontFamily: "Futura"}}>{props.item.name}</h3>
        <div style={{width: barWidth, height: "12pt", background: "white"}}></div>
    </div>)
}

const ResultsPage = (props: ResultsPageProps) => {
    var x:number = 0;
    var viewArray = []
    while (x<props.items.length){
        viewArray.push(<ResultItem item={props.items[x]}/>)
        x++
    }
    return (
        <div style={{ display: "flex", background: "#1C3FFF", justifyContent: "left", marginLeft: "72pt" }}>
        {viewArray}
    </div>)
}


export default Item