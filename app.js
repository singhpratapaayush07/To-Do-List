//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");


const app = express();


mongoose.connect("mongodb+srv://admin-aayush:Test123@cluster0.lf9t7.mongodb.net/todolistDb",{ useNewUrlParser: true , useUnifiedTopology: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const listSchema= new mongoose.Schema({
  name:String
});

const listModel= mongoose.model("list",listSchema);

const item1= new listModel({
  name: "Welcome to To-do List"
});

const item2= new listModel({
  name: "<-- Hit this to delete item"
});

const item3= new listModel({
  name: "Hit + to add Item"
});
const defaultItems=[item1,item2,item3];


app.get("/", function(req, res) {

  listModel.find({},function(err,data){
    if(data.length===0){
      listModel.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("defaultItems Saved !");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: data}); //data is fetched data fro database using find
    }

  });

});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const newItem= new listModel({
    name:itemName
  });
  newItem.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedBoxID= req.body.checkbox;
  listModel.deleteOne({_id:checkedBoxID},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Item deleted Successfully");
    }
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});
