import React, { useState } from 'react';
import './App.css';
import likeImage from "./thumbup.svg"
import dislikeImage from "./thumbdown.svg"
import axios from 'axios';
import FormData from 'form-data';
function App() {
  const [pageContent, setPageContent] = useState("ObjectWindow")
  var content = {}

  if (pageContent === "ObjectWindow"){
    content = <ObjectWindow numberOfItems={2} category="car" />
  }
  if (pageContent === "UploadObjectView"){
    content = <UploadObjectView />
  }
  return (
    <div >
      <button onClick={()=>{
        if (pageContent === "ObjectWindow"){
          setPageContent("UploadObjectView")
        }
        else{
          setPageContent("ObjectWindow")
        }
      }}>Switch view</button>
        <div style={{display: "flex", justifyContent: "center"}}>
        {content}
        </div>
    </div>
  );
}


interface ObjectWindowProps{
  numberOfItems: number
  category: string
}

interface ObjectType{
  id: string
  name: string
  description: string
  imageUrl: string
  categories: string[]
  upvotes: number
  downvotes: number

}


const ObjectWindow = (props: ObjectWindowProps) =>{
  var objectsArray: ObjectType[] = []
  axios.get<ObjectType[]>("/get_new_objects", {headers: {"quantity": props.numberOfItems, "category": props.category}})
  .then((result)=>{
    console.log("result form get new objs", result)
    objectsArray = result.data
  })

  console.log("objects array test", objectsArray)
  var obj:ObjectType = objectsArray[0]
  var objCard = <ObjectCard id={obj.id} name={obj.name} description={obj.description} 
   imageUrl={obj.imageUrl} categories={obj.categories} upvotes={obj.upvotes} downvotes={obj.downvotes} />

  return(
    <div style={{width: "288pt", height: "432pt", backgroundColor: "grey"}}>
      <div style={{ display: "flex", width: "288pt", height: "72pt", justifyContent: "center", marginTop: "360pt"}}>
      {objCard}
      </div>
    </div>)
}

interface CardProps{
  id: string
  name: string
  description: string
  imageUrl: string
  categories: string[]
  upvotes: number
  downvotes: number
}
const ObjectCard = (props: CardProps) => {
  return (
    <div style={{width: "288pt", height: "432pt"}}>
      <h2>{props.name}</h2>
      <img style={{width:"288pt"}} src={props.imageUrl}></img>
      <img onClick={()=>{upvoteObject(props.id)} }  style={{backgroundImage: `url(${likeImage}`, 
        backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "48pt", height: "48pt"}} />
      <img onClick={()=>{downvoteObject(props.id)} }  style={{backgroundImage: `url(${dislikeImage}`,
      backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "48pt", height: "48pt"}} />

    </div>
  )

  function upvoteObject(id: string){
    axios.get("/upvote_object", {headers: {objectID: id}})
    .then((result)=>{
      console.log("success upvoted", result)
    })
    .catch((error)=>{
      console.log("failed upvoting", error)
    })
  }
  function downvoteObject(id: string){
    axios.get("/downvote_object", {headers: {objectID: id}})
    .then((result)=>{
      console.log("success upvoted", result)
    })
    .catch((error)=>{
      console.log("failed upvoting", error)
    })
  }
}






interface UploadItem{
  name: string
  description: string
  imageUrl: string
  categories: string[]
  upvotes: number
  downvotes: number
}


const UploadObjectView = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState([""])
  const [imageUrl, setImageUrl] = useState("")


  
  return(
    <div>
      <h2>Name</h2>
      <input type="text"
        value={name}
        onChange={(e) => {setName(e.target.value)}} ></input>
      <h2>Description</h2>
      <input value={description}
        onChange={(e) => {setDescription(e.target.value)}} ></input>
      <h2>Picture</h2>
      <input type="file" name="file" onChange={ (e) => { if ( e.target.files !== null ) {uploadImageToS3( e.target.files[0] )}}}></input>
      <h2>Categories</h2>
      <input value={categories}
        onChange={(e) => {setCategories(e.target.value.split(","))}} ></input>
      <button onClick={()=>{uploadObject()}}>Upload Object</button>
    </div>
  
  )

  function uploadImageToS3(image: File){
    console.log("file in upload check", image)

    const uploadData:FormData = new FormData()
    uploadData.append("file", image)
    const awsURL = "https://big-bucket-of-objects.s3.us-west-1.amazonaws.com/"
    console.log("form data check", uploadData)
    axios.post("/upload_image", uploadData, {headers:{ "Content-Type": "multipart/form-data" }})
      .then((response)=>{
        console.log(response)
        setImageUrl(awsURL + image.name)
      })
      .catch((error)=>{
        console.log(error)
      })
  }
  
  function uploadObject(){
    var uploadItem: UploadItem = {name: name, description: description, imageUrl: imageUrl, categories: categories, upvotes: 0, downvotes: 0}
    if (imageUrl !== ""){
      axios.post("/enter_new_object", JSON.stringify(uploadItem), {headers: {"Content-Type": "application/json"}})
      .then((result)=>{
        console.log("result from enter new item", result)
      })
      .catch((error)=>{
        console.log("error from new item", error)
      })
    }
    else{
      alert("please upload an image first!")
    }
  }
}
export default App;
