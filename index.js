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
const Item = mongoose.model("items_tables", ItemSchema)

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())

const HTTP_PORT = process.env.PORT || 8080;

// ----------------------------------
// Url endpoints
// ----------------------------------
// GET ALL
app.get("/api/items", (req, res) => {
    // 1. search the database for items and return them
    Item.find().exec().then(
        (results) => {
            console.log(results)
            res.status(200).send(results)
        }
    ).catch(
        (err) => {
            console.log(error)
            res.status(500).send("Internal Server Error when getting all Items from database.")
        }
    )    
})

// get item by name
app.get("/api/items/:item_name", (req, res) => {
    console.log(`Searching for: ${req.params.item_name}`)

    Item.find({name:req.params.item_name}).exec()
        .then(
            (result) => {
                console.log(`Result from database: `)
                console.log(result)
                if (result === null) {
                    console.log("record not found")
                    const msg = {
                        statusCode:404,
                        msg: "Record not found"
                    }
                    res.status(404).send(msg)
                }
                else {
                    console.log("Item found")                    
                    res.status(200).send(result)
                }                
            }
        ).catch(
            (err) => {
                console.log(`Error`)
                console.log(err)
                const msg = {
                    statusCode:500,
                    msg: "Error when getting item by name from database."
                }
                res.status(500).send(msg)

            }
        )  
})

//get item(s) by rarity
app.get("/api/items/:irarity", (req,res) => {
    // 1. Determine which items the user wants
    // - by rarity 
    
    console.log(`Searching for: ${req.params.irarity}`)


    Item.find({rarity:req.params.irarity}).exec()
        .then(
            (results) => {
                console.log(`Result from database: `)
                console.log(results)
                if (results === null) {
                    console.log("record not found")
                    const msg = {
                        statusCode:404,
                        msg: "Record not found"
                    }
                    res.status(404).send(msg)
                }
                else {
                    console.log("Item(s) found")                    
                    res.status(200).send(results)
                }
                
            }
        ).catch(
            (err) => {
                console.log(`Error`)
                console.log(err)
                const msg = {
                    statusCode:500,
                    msg: "Error when getting items from database."
                }
                res.status(500).send(msg)

            }
        )
})

// INSERT 
app.post("/api/items", (req, res) => {

    // 1. what did the client send us
    // - what data does the client want us insert into the database
    console.log("User Given:")
    console.log(req.body)
    
    Item.create(req.body).then(
        (result) => {
            //javascript
            console.log("Create success!")
            console.log(result)
            // express
            res.status(201).send("Insert success!")
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when creating item from database."
            }
            res.status(500).send(msg)
        }
    )    
})

// 4. update
app.put("/api/items/:item_id", (req,res) => {
    // 1. get id from the URL params
    const itemIdFromUser = parseInt(req.params.item_id)
    // 2. get the body from the request
    const itemData = req.body

    console.log(`API endpoint will be available in a future update`)

    res.status(501).send({"msg":`API endpoint will be available in a future update`})
})


// delete
app.delete("/api/items/:item_name", (req,res) => {
    // 1. Get the item Name    
    Item.findOneAndDelete({name:req.params.item_name}).exec().then(
        (deletedItem) => {
            if (deletedItem === null) {           
                console.log("Could not find a item to delete")
                res.status(404).send("Could not find a item to delete")
            }
            else {
                console.log(deletedItem)
                res.status(201).send("deletion success!")
            }
        
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when deleting item from database."
            }
            res.status(500).send(msg)
        }
    )
})

app.get("/", (req, res) => {
    // JSON , XML
    // All data sent to the API endpoint, are sent in JSON format
    // All replies sent by the server are sent in JSON Format    
    res.status(418).send({"name":"testttta3", "age":99});
});




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