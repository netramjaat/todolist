
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require("lodash") ;
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
//mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser : true});
mongoose.connect('mongodb+srv://choudharynetram:gvv3MlM0yp1gN5CK@cluster0.rehfy7a.mongodb.net/todolistDB', {useNewUrlParser : true});
// mongoose.connect('mongodb+srv://choudharynetram:' + encodeURIComponent('Netram@7877') + '@cluster0.wxxhmte.mongodb.net/todolistDB', {useNewUrlParser : true});

const itemsSchema = new Schema({
  name:  String
});
 
const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  name:"Welcome to your ToDo List!"});
const item2 = new Item({
  name:"Hit the + button to add new item."});
const item3 = new Item({
  name:"<-- Hit this to delete an item."});
 
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String , 
    items : [itemsSchema]
};

const List = mongoose.model("List" , listSchema) ;
const workItems = [];
 
app.get("/", function(req, res) {

    Item.find({})
        .then(foundItems => {
            if(foundItems.length === 0){
                Item.insertMany(defaultItems).then(function () {
                    console.log("Successfully saved default items to DB");
                  }).catch(function (err) {
                    console.log(err);
                  });
                  res.redirect("/") ;
            }
            else {
                res.render("list", {listTitle: "Today", newListItems: foundItems});

            }
        })
        .catch(err => {
            console.log(err);
        });
});
app.get("/:customListName" , function(req,res){
    const customListName = _.capitalize(req.params.customListName) ;
    List.findOne({name:customListName})
      .then(foundList => {
        if(!foundList){
            const list = new List({
                name : customListName,
                items : defaultItems 
              });
              list.save();
              res.redirect("/"+customListName) ;
            // create a new list 
          //console.log("doesn't exist!") ;
        }
        else {
            res.render("list" ,{
                listTitle: foundList.name ,
                newListItems: foundList.items  
            }) ;
            // show an existing list 
          //console.log("Exists!") ;
        }
      })
      .catch(err => console.log(err));
    
    
    
  });
  
app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list ; 
    const item = new Item({
      name : itemName 
    });
    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }
    else {
      List.findOne({name:listName})
        .then(foundList => {
          foundList.items.push(item) ;
          foundList.save() ;
          res.redirect("/" + listName) ;
        })
        .catch(err => console.log(err));
    }
  });
  
  
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox ; 
    const listName = req.body.listName ; 
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId)
        .then(() => {
            console.log("successfully deleted checked item.");
            res.redirect("/");
        })
        .catch(err => console.log(err));

    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then((foundList) => {
            res.redirect("/" + listName);
        })
        .catch((err) => {
            console.log(err);
        });

    }
    
});


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
  
});
 
app.get("/about", function(req, res){
  res.render("about");
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});


