
import axios from "axios"
import likeImage from "./images/thumbup.svg"
import dislikeImage from "./images/thumbdown.svg"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
function Item() {
    const params = useParams();
    const title = params.title as string
    console.log("data test", title)
    var currentObject: number = 0
    
    const ObjectWindow = (props: ObjectWindowProps) => {
        const [objectsArray, setObjectsArray] = useState<ObjectType[]>(() => {
            var obj: ObjectType = { id: "_", name: "_", description: "_", imageUrl: "_", categories: ["_"], upvotes: 0, downvotes: 0 }
            var array: ObjectType[] = [obj, obj]
            return array
        })

        useEffect(() => {
            axios.get<ObjectType[]>("/get_new_objects", { headers: { "quantity": props.numberOfItems, "categories": props.categories[0].toLowerCase() } })
                .then((result) => {
                    console.log("result from get new objs", result)
                    setObjectsArray(result.data)
                })
        }, [])

        return (
            <div style={{ display: "flex", width: "288pt", height: "496pt", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <p style={{ color: "white", fontStyle: "condensed", fontFamily: "Futura", margin: 0 }}>vote on a few items to proceed</p>
                </div>
                <ObjectCard id={objectsArray[currentObject].id} name={objectsArray[currentObject].name} description={objectsArray[currentObject].description}
                    imageUrl={objectsArray[currentObject].imageUrl} categories={objectsArray[currentObject].categories}
                    upvotes={objectsArray[currentObject].upvotes} downvotes={objectsArray[currentObject].downvotes} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={likeImage} onClick={() => { upvoteObject(objectsArray[currentObject].id) }} style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "48pt", height: "48pt", cursor: "pointer"
                    }} />
                    <img src={dislikeImage} onClick={() => { downvoteObject(objectsArray[currentObject].id) }} style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", marginLeft: "24pt", width: "48pt", height: "48pt", cursor: "pointer"
                    }} />
                </div>
            </div>
        )


        function upvoteObject(id: string) {
            axios.get("/upvote_object", { headers: { objectID: id } })
                .then((result) => {
                    console.log("success upvoted", result)
                    currentObject++
                })
                .catch((error) => {
                    console.log("failed upvoting", error)
                })
        }
        function downvoteObject(id: string) {
            axios.get("/downvote_object", { headers: { objectID: id } })
                .then((result) => {
                    console.log("success upvoted", result)
                    currentObject++
                })
                .catch((error) => {
                    console.log("failed upvoting", error)

                })
        }
    }


    const ObjectCard = (props: ObjectType) => {
        return (
            <div style={{ width: "288pt", height: "396pt" }}>
                <h2>{props.name}</h2>
                <div style={{width:"288pt", height: "288pt"}}>
                    <img style={{ width: "288pt", height: "auto", border: "none" }} src={props.imageUrl} ></img>

                </div>
            </div>
        )

    }

    const Results = (props: ResultsProps) => {

        const [resultsArray, setResultsArray] = useState<ObjectType[]>(() => {
            var obj: ObjectType = { id: "", name: "", description: "", imageUrl: "", categories: [""], upvotes: 0, downvotes: 0 }
            var array: ObjectType[] = [obj, obj]
            return array
        })

        useEffect(() => {
            axios.get<ObjectType[]>("/get_top_objects", { headers: { "quantity": props.numberOfItems, "categories": props.categories[0].toLowerCase() } })
                .then((result) => {
                    console.log("result from get new objs", result)
                    setResultsArray(result.data)
                })
        }, [])

        resultsArray.sort((a, b) => a.upvotes - b.upvotes);

        var title:string = resultsArray[0].name
        var upvotes:number = resultsArray[0].upvotes
        var downvotes:number = resultsArray[0].downvotes

        var resultItems = []
        var x:number = 0;
        while (x<resultsArray.length){
            resultItems.push(<ResultItem title={title} upvotes = {upvotes} downvotes = {downvotes} />)
            x++
        }

        return (
        <div>

        </div>)
    }


    var windowContent = <ObjectWindow numberOfItems={10} categories={[title]}/>
    if ( currentObject > 9){ 
        windowContent=<Results categories={[title]} numberOfItems={10} />
    }


    return (
        <div style={{ display: "flex", background: "#1C3FFF", justifyContent: "center" }}>
            {windowContent}
        </div>)





}
interface ObjectWindowProps {
    numberOfItems: number
    categories: string[]
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

interface ResultsProps{
    categories: string[]
    numberOfItems: number
}

interface ResultItemProps{
    title: string
    upvotes: number
    downvotes: number
}

const ResultItem = (props: ResultItemProps) => {

    var totalVotes: number = props.upvotes + props.downvotes
    var upvoteShare: number = props.upvotes/totalVotes
    const FullBarWidthInPts:number = 432;
    const barWidth:string = (upvoteShare * FullBarWidthInPts) + "pt"
    return(
    <div style={{display: "flex", flexDirection: "row"}}>
        <h3 style={{fontFamily: "Futura"}}>{props.title}</h3>
        <div style={{width: barWidth, height: "12pt", background: "white"}}></div>
    </div>)
}


export default Item