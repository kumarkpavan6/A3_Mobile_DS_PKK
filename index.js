// ----------------------------------
// mongo setup
// ----------------------------------
const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://dbuser:pa55word@storecluster.jntmj.mongodb.net/College?retryWrites=true&w=majority"

const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}


// add your table schemas
const Schema = mongoose.Schema

const ItemSchema = new Schema({
   name:String,
   rarity:String,
   description:String,
   goldPerTurn:Number
})
const Student = mongoose.model("items_table", ItemSchema)

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;












// ----------------------------------
// start server
// ----------------------------------
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}


// 1. connect to the database
// 2. AFTER you successfully connect, that you start he expres server
mongoose.connect(mongoURL, connectionOptions).then(
    () => {
         console.log("Connection success")
         app.listen(HTTP_PORT, onHttpStart); 
    }
 ).catch(
    (err) => {
        console.log("Error connecting to database")
        console.log(err)
    }
)