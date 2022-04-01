require("dotenv").config()
const express = require('express')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 8080
const axios = require("axios")
const { S3 } = require("aws-sdk")
const {MongoClient} = require("mongodb")
const upload = require("express-fileupload");
const awsBucketName = process.env.AWS_BUCKET_NAME
const awsRegion = process.env.AWS_BUCKET_REGION
const awsKey = process.env.AWS_BUCKET_KEY
const awsSecret = process.env.AWS_SECRET_KEY 
const ObjectId = require('mongodb').ObjectId;

const s3 = new S3({
  region: awsRegion, 
  accessKeyId: awsKey, 
  secretAccessKey: awsSecret
})


function allAreNull(arr) {
  return arr.every(element => element === null);
}


app.use(upload())
app.use(express.json())
console.log("env test", process.env)
console.log("env mongo pass test", process.env.MONGODB_PASSWORD)
const uri = "mongodb+srv://best-things-server:" + process.env.MONGODB_PASSWORD +
 "@cluster0.dewpn.mongodb.net/bestThingsDB?retryWrites=true&w=majority"
const mongoClient = new MongoClient(uri)
mongoClient.connect()
const db = mongoClient.db("bestThingsDB")
const objectsCollection = db.collection("objects")

app.get('/test', (req, res) => {
  console.log("got /test path")
  res.send('Hello World!')
})

app.put("/upvote_object", (req, res)=>{
  console.log("got to downvote obj", ObjectId(req.headers._id))
  objectsCollection.updateOne(
    {_id: ObjectId(req.headers._id)},
    { $inc: { upvotes: 1 } }
    )
    .then((response)=>{
      res.status(200).send("successful downvote")
    })
    .catch((error)=>{
      res.status(500).send(error)
    })
})


app.put("/downvote_object", (req, res)=>{
  console.log("got to downvote obj", ObjectId(req.headers._id))
  objectsCollection.updateOne(
    {_id: ObjectId(req.headers._id)},
    { $inc: { downvotes: 1 } }
    )
    .then((response)=>{
      res.status(200).send("successful downvote")
    })
    .catch((error)=>{
      res.status(500).send(error)
    })
})





app.get("/get_new_objects", (req, res) => {
    console.log("got to /get_new_objects")
    console.log(req.headers)
    var quantity = req.headers.quantity
    console.log(req.headers.categories)
    var categories = req.headers.categories
    console.log("categories header value", categories)
    var category = "cars"
    if (typeof categories === "string"){
      category = categories.toLowerCase()
    }
    else{
      category = categories[0].toLowerCase()
    }

    objectsCollection.find( { categories: category } ).toArray()
    .then((results)=>{
      var objectsArray = results
      var finalArray = []
      var x = 0;
      while (x<quantity){
        finalArray.push(objectsArray[x])
        x++
      }

      if (finalArray[0] != null){
        console.log("data from mongo", results)
        res.status(200).send(finalArray)
      }
      else{
        res.status(500).send("array was null")
      }
    })
    .catch((error)=>{
      res.status(500).send(error)
    })
})

app.get("/get_top_objects", (req, res) => {
  console.log("got to /get_new_objects")
  console.log(req.headers)
  var quantity = req.headers.quantity
  console.log(req.headers.categories)
  var categories = req.headers.categories
  var category = "cars"
  if (typeof categories === "string"){
    category = categories
  }
  else{
    category = categories[0]
  }
  
  objectsCollection.find( { categories: category } ).toArray()
  .then((results)=>{
    var objectsArray = results
    var finalArray = []

    var x = 0; 
    while(x<objectsArray.length){
      objectsArray[x].upvoteShare = objectsArray[x].upvotes / (objectsArray[x].upvotes + objectsArray[x].downvotes)
      x++
    }

    //sorty by upvote share so we can get the top objects
    objectsArray.sort((a, b) => (a.upvoteShare < b.upvoteShare) ? 1 : -1)
    var i = 0;
    while(i<quantity){
      finalArray.push(objectsArray[i])
      i++
    }
    
    if (finalArray[0] != null){
      console.log("data from mongo", results)
      res.status(200).send(finalArray)  
    }
})
  .catch((error)=>{
    res.status(500).send(error)
  })
})






app.post("/enter_new_object", (req, res) => {
  console.log("got to /enter_new_object")

  objectsCollection.insertOne(req.body).then((result)=>{
    console.log("successfully inserted object to mongodb")
    res.status("200").send("successful insertion")
  })
  .catch((error)=>{
    console.log("failure to insert to db", error )
    res.send(error)
  })

})


app.post("/upload_image", (req, res)=>{
  console.log("got /upload_image")
  console.log("process test", process, process.env)
  console.log("file test", req.files.file)
  console.log("awsBucketName", awsBucketName)
    s3.putObject({
      Bucket: awsBucketName,
      Body: req.files.file.data,
      Key: req.files.file.name
    }).promise().then((result) => {
      console.log("aws success putObject!")
      res.send(result)
    }).catch((error) => {
      console.log("aws error putObject...")
      console.log("aws error: ", error)
    })
})

app.set('port', (process.env.PORT || 8080));


app.listen(PORT, ()=> {
  console.log("server created and listening on " + PORT)
  if (process.env.NODE_ENV === "production") {
    console.log("server running in production")
    app.use(express.static(path.join(__dirname, "../build")))
    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "../build", "index.html"));
    });
  }
})
