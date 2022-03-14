import React, { useState } from 'react';
import './App.css';
import likeImage from "./thumbup.svg"
import dislikeImage from "./thumbdown.svg"
import axios from 'axios';
import FormData from 'form-data';
function App() {
  const [pageContent, setPageContent] = useState("UploadObjectView")
  var content = {}

  if (pageContent === "RankerWindow"){
    content = <RankerWindow numberOfItems={1} category="none" />
  }
  if (pageContent === "UploadObjectView"){
    content = <UploadObjectView />
  }
  return (
    <div >
        <div style={{display: "flex", justifyContent: "center"}}>
        {content}
        </div>
    </div>
  );
}


interface RankerWindowProps{
  numberOfItems: number
  category: string
}

const RankerWindow = (props: RankerWindowProps) =>{
  return(
    <div style={{width: "288pt", height: "432pt", backgroundColor: "grey"}}>
      <div style={{ display: "flex", width: "288pt", height: "72pt", justifyContent: "center", marginTop: "360pt"}}>
        <img style={{backgroundImage: `url(${likeImage}`, 
        backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "48pt", height: "48pt"}} />
        <img style={{backgroundImage: `url(${dislikeImage}`,
         backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "48pt", height: "48pt"}} />
      </div>
    </div>)
}

interface CardProps{
  image: string
  category: string
  upvotes: number
  downvotes: number
}
const RankerCard = (props: CardProps) => {
  return (
    <div>

    </div>
  )
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
      axios.post("/enter_new_object", JSON.stringify(uploadItem) {headers: {"Content-Type": "application/json"}})
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
