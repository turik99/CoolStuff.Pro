
import axios from "axios"
import likeImage from "./images/thumbup.svg"
import dislikeImage from "./images/thumbdown.svg"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReactTooltip from 'react-tooltip';

function Item() {
    const params = useParams();
    const title = params.title as string
    console.log("data test", title)
    const [votingFinished, setVotingFinished] = useState(false)
    const [items, setItems] = useState(()=>{
        var array:ObjectType[] = []
        array.push({_id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0})
        return array
    })
    
    useEffect(()=>{
        //Checking if voting is either finished or the user already visited and voted
        if (votingFinished || localStorage.getItem(title) != null){
            axios.get<ObjectType[]>("/get_top_objects", {headers: {quantity: 10, categories: title}})
            .then((res)=>{
                if (res.data[0] != null){
                    setItems(res.data)
                }
                else{
                    setItems([{_id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0}])
                }
            })
            .catch((error)=>{
                console.log(error)
                setItems([{_id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0}])
            })
        }
        else {
            axios.get<ObjectType[]>("/get_new_objects", {headers: {quantity: 7, categories: title}})
            .then((res)=>{
                if (res.data[0] != null){
                    setItems(res.data)
                }
                else{
                    setItems([{_id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0}])
                }
            })
            .catch((error)=>{
                console.log(error)
                setItems([{_id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0}])
            })
        
        }
    }, [votingFinished])

    const ItemCardView = (props: ItemCardViewProps) => {
        const [currentItem, setCurrentItem] = useState(0)
        const remaining = props.items.length - currentItem

        console.log("item props test", props)
        return(
            <div style={{display: "flex", alignItems: "center", marginTop: "12pt", flexDirection: 'column'}}>
                <div style={{display: "flex",  marginTop: 0, alignItems: "center", flexDirection:"column"}}>                
                    <p style={{margin: "4pt", color: "white", fontFamily: "Futura", fontStyle: "italic", fontSize: "15pt"}}>(vote on  a few items to see results)</p>
                    <p style={{margin: "4pt", color: "white", fontFamily: "Futura", fontStyle: "italic", fontSize: "15pt"}}>{remaining} item(s) remaining</p>
                </div>
                
            <div style={{width: "288pt", height: "360pt", display: "flex", flexDirection: "column", alignItems: "center", border: "solid white"}}>
                <h2 style={{color: "white", fontFamily: "Futura"}}>{props.items[currentItem].name}</h2>
                <img src={props.items[currentItem].imageUrl} style={{width: "auto", height: "auto", maxWidth: "288pt", maxHeight: "288pt"}}></img>
                <div style={{display: "flex", justifyContent: "center", marginTop: "auto", marginBottom: "12pt"}}>
                    <img style={{width: "48pt"}} onClick={ ()=>{ upvote(props.items[currentItem]._id) } } src={likeImage}></img>
                    <img style={{width: "48pt", marginLeft: "12pt"}} onClick={ ()=>{ downvote( props.items[currentItem]._id ) } } src={dislikeImage}></img>
                </div>
            </div>
            </div>
            )
        
        function upvote(id: string){
            console.log("upvote id test", id)

            axios.put("/upvote_object", {}, {headers: {_id: id} })
            .then((res)=>{
                console.log("successful upvote", res.data)
                if (currentItem + 1 === items.length){
                    localStorage.setItem(title, title);
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
            console.log("downvote id test", id)
            axios.put("/downvote_object", {}, {headers: {_id: id} })
            .then((res)=>{
                console.log("successful downvote", res.data)
                if (currentItem + 1 === items.length){
                    setVotingFinished(true)
                    localStorage.setItem(title, title);
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
    if (votingFinished || localStorage.getItem(title) != null){
        windowContent = <ResultsPage items={items} />
    }
    return(
    <div>
        {windowContent}
    </div>)
}



interface ItemCardViewProps{
    items: ObjectType[]
}

interface ObjectType {
    _id: string
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
    console.log("result item props", props)
    var totalVotes: number = props.item.upvotes + props.item.downvotes
    var upvoteShare: number = props.item.upvotes/totalVotes
    const FullBarWidthInPts:number = 432;
    const barWidth:string = (upvoteShare * FullBarWidthInPts).toString().concat("pt")
    const oppositeBarWidth = ( (1 - upvoteShare) * FullBarWidthInPts).toString().concat("pt")
    console.log("bar width test", barWidth)
    return(
    <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{display: "flex", justifyContent: "right", width: "144pt"}}>
            <h3 style={{fontFamily: "Futura", color: "white", margin: "12pt"}}>{props.item.name}</h3>
        </div>
        <ReactTooltip />
        <div data-tip={ Math.round(upvoteShare * 100) + "% liked"} style={{width: barWidth, height: "18pt", background: "#6eff81", marginTop: "12pt", marginBottom: "12pt", marginLeft: "12pt"}}></div>
        <div data-tip={Math.round((1-upvoteShare )* 100) + "% disliked"} style={{width: oppositeBarWidth, height: "18pt", background: "#f54949", marginTop: "12pt", marginBottom: "12pt"}}></div>
        
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
    <div style={{ display: "flex", background: "#1C3FFF", alignItems: "center", flexDirection: "column", marginLeft: "0pt", marginTop: "12pt" }}>
        <p style={{fontFamily: "Futura", fontWeight: 'bold', color: "white", margin: "12pt", fontSize: "24pt"}}>Top&nbsp;{props.items[0].categories}</p>
        <p style={{fontFamily: "Futura", fontStyle: "italic", color: "white", margin: "12pt", fontSize: "15pt"}}>as rated by the community</p>
        <div style={{ display: "flex", background: "#1C3FFF", justifyContent: "left", flexDirection: "column", marginLeft: "0pt", marginTop: "12pt" }}>
            {viewArray}
        </div>
    </div>)
}

export default Item