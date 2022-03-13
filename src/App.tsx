import React, { useState } from 'react';
import './App.css';
import likeImage from "./thumbup.svg"
import dislikeImage from "./thumbdown.svg"
import axios from 'axios';
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
        <h1>
          Welcome to the best things in the universe.
        </h1>
        <h2>vote on a few items to get started!</h2>
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

function uploadObject(uploadItem: UploadItem){


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
  const [categories, setCategories] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  var uploadItem: UploadItem = {name: name, description: description, imageUrl: imageUrl, categories: [categories], upvotes: 0, downvotes: 0}

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
      <input type="file" onChange={ (e) => { if ( e.target.files !== null ) {uploadImageToS3( e.target.files[0] )}}}></input>
      <h2>Categories</h2>
      <input value={categories}
        onChange={(e) => {setCategories(e.target.value)}} ></input>

      <button onClick={()=>{uploadObject(uploadItem)}}>Upload Object</button>
    </div>
  
  )


  function uploadImageToS3(image: File){
    const uploadData:FormData = new FormData()
    uploadData.append(image.name, image)
    axios.post("https://localhost:8080/https://floating-harbor-33765.herokuapp.com/upload_image", uploadData)
      .then((response)=>{
        console.log("response from AWS", response)
      })
      .catch((error)=>{
        console.log("failure from AWS", error)
      })


  }
  
}

export default App;
