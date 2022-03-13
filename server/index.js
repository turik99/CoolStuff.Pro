require("dotenv").config()
const express = require('express')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 8080
const axios = require("axios")
const { S3 } = require("aws-sdk")
const awsBucketName = process.env.AWS_BUCKET_NAME
const awsRegion = process.env.AWS_BUCKET_REGION
const awsKey = process.env.AWS_BUCKET_KEY
const awsSecret = process.env.AWS_SECRET_KEY 
const s3 = new S3({
  region: awsRegion, 
  accessKeyId: awsKey, 
  secretAccessKey: awsSecret
})


app.get('/test', (req, res) => {
  console.log("got /test path")
  res.send('Hello World!')
})

app.get("/get_next_item", (req, res) =>{
    console.log("got /get_next_item")
})

app.get("/get_new_items", (req, res) => {

  if (req.body.category === "none"){
    var responseObj = {}
  }
})

app.post("/enter_new_item", (req, res) => {
  

})


app.post("/upload_image", (req, res)=>{
  console.log("got /upload_image")
  console.log("request from client", req)
  console.log("file from client", req.files)
  s3.upload({
    Bucket: awsBucketName,
    Body: req.file.image,
    Key: req.file
  }).promise().then((result) => {
    res.send(result)
  }).catch((error) => {
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
