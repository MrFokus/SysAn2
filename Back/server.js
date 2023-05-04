const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const labModel = require('./labModel.js');
app.use(cors());
app.use(bodyParser.json())
app.get('/',()=>{
    console.log("gxflcbkxnclbzncklzfk")
})
app.post('/',(req,res)=>{
     // console.table(req.body);
    console.log("xcbsfdbsfdv")
    res.json(labModel.Result(req.body.matrix));
})
app.listen(3001, ()=>{
    console.log("Server is running on 3001")
});