const express = require("express") ;
const bodyParser = require("body-parser") ; 
const { MongooseError } = require("mongoose");
const app = express() ; 
const mongoose = require("mongoose");
const {Schema } = mongoose ; 
app.set("view engine" ,"ejs") ; 
app.use(bodyParser.urlencoded({extended:true})) ; 
app.use(express.static("public")) ;

main().catch(err => console.log(err));
 
async function main() {
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema  = {
    name : String 
} ; 
const Item = mongoose.model(
    "Item" ,  itemsSchema
);
const item1 = new Item({
    name : "Welcome to your todolist" 
});
const item2 = new Item({
    name : "Hit the + button to add a new item" 
});
const item3 = new Item({
    name : "<-- hit this to delete the item" 
});
const defaultItems = [item1, item2, item3] ;
Item.insertMany(defaultItems)
  .then(() => {
    console.log("Successfully inserted the default items into todolistDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", function(req, res){    
    res.render("list", {listTitle : "Today",  newListItems:items}) ;  // list is a ejs  file 

});
app.post("/", function(req, res){
    let item = req.body.newItem ; 
    if(req.body.list === "Work"){
        workItems.push(item) ;
        res.redirect("work") ; 
    }
    else {
        items.push(item) ;
        res.redirect("/") ;
    }
    
    
}) ;
app.get("/work" , function(req,res){
    res.render("list", {listTitle:"Work List",  newListItems:workItems})
}) ;

app.get("/about", function(req, res){
    res.render("about") ; 
});


app.post("/work" , function(req,res){
    let item = req.body.newItem ; 
    workItems.push(item) ;
    res.redirect("/work") ; 
}) ;

app.listen(3000, function(){
    console.log("server started on port 3000") ; 
});


} 