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
  res.send('Hello World!')
})

app.get("/get_next_item", (req, res) =>{
    
})

app.get("/get_new_items", (req, res) => {
  if (req.body.category === "none"){
    var responseObj = {}
  }
})

app.post("/enter_new_item", (req, res) => {
  

})


app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname,
  "build", "index.html"));
});

app.post("/upload_image", (req, res)=>{
  console.log("")
  console.log("request from client", req.body)
  s3.upload({
    Bucket: awsBucketName,
    Body: req.body.image,
    Key: req.body.file.name
  }).promise().then((result) => {
    res.send(result)
  })
})

app.use(express.static(path.join(__dirname, "build")));

app.listen(()=>{
  console.log("server created and listening on " + PORT)
})
