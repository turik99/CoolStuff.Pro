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
const s3 = new S3({
  region: awsRegion, 
  accessKeyId: awsKey, 
  secretAccessKey: awsSecret
})

app.use(upload())
app.use(express.json())
console.log("env test", process.env)
console.log("env test FUCK", process.env.FUCK)
console.log("env mongo pass test", process.env.MONGODB_PASSWORD)
const uri = "mongodb+srv://best-things-server:" + process.env.MONGODB_PASSWORD + "@cluster0.dewpn.mongodb.net/bestThingsDB?retryWrites=true&w=majority"
const mongoClient = new MongoClient(uri)
mongoClient.connect()
const db = mongoClient.db("bestThingsDB")
const objectsCollection = db.collection("objects")


app.get('/test', (req, res) => {
  console.log("got /test path")
  res.send('Hello World!')
})


app.get("/get_new_objects", (req, res) => {
    console.log("got to /get_new_objects")
    console.log(req.headers.quantity)
    var quantity = req.headers.quantity
    console.log(req.headers.category)
    var category = req.headers.category
    objectsCollection.find({"categories": category}).toArray()
    .then((results)=>{
      var objectsArray = results
      var finalArray = []
      var x = 0;
      while (x<quantity){
        finalArray.push(JSON.stringify(objectsArray[x]))
        x++
      }
      res.status(200).json(finalArray)
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
