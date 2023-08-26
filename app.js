//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoUnexpectedServerResponseError } = require("mongodb");
const _=require("lodash")
const NODE_VERSION="^20.5.1"
//--------------------------------------------------------------------------------------------------------------------//
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//---------------------------------------------------------------------------------------------------------------------------------//
//establishing mongoose connection
mongoose.connect("mongodb+srv://angdalwarpratham:Prathamangdalwar2004@cluster0.tx94tiu.mongodb.net/todolistdb", {
  useNewUrlParser: true,
});

//creating mongoose schema
const itemschema = new mongoose.Schema({ name: String,});
//creating model of a mongoose schema
const item = mongoose.model("item", itemschema);
//creating objects of the above model
const item1 = new item({ name: "Pratham" });
const item2 = new item({ name: "himansh" });
const item3 = new item({ name: "devansh" });

//creating a array of default items in our todolist
const defaultItems = [item1, item2, item3];

//creating a new schema 
const listschema = new mongoose.Schema({
  name: String,
  items: [itemschema],
});
//creating a new model based on new schema
const list = mongoose.model("list", listschema);

//------------------------------------------------------------------------------------------------------------------------------------//
// "/"get request will do following functions
app.get("/", function (req, res) {
  //this will find how many objects does array of model,item contains(us model me kitne objects) 
  item.find({}).then((foundItems) => {

    //if it contains no objects then add some default objects 
      if (foundItems.length === 0) {
        item.insertMany(defaultItems).then(function () {
        console.log("success");
        }).catch(function (err) {
            console.log(err);
                                  });
      } 
    //if it already contains some object then get the name of object and send it to the ejs page to display
      else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//we get the data from webpage through post request
app.post("/", function (req, res) {
  //read the name of new task added
  const itemname = req.body.newItem;
  //it will give us the title of the page(heading) initially it is today
  const listname = req.body.list;
  
  //here we create a object of item model with its name as the name of added task
  const Item = new item({
    name: itemname,
  });
  //checking if the page is of name today if it is then add the object(task) on today page 
  if (listname === "Today") {
    Item.save();
    res.redirect("/");
  }
  else{
    //find the page of the given name and then will add the task to that page by adding the object in array of the particular model
    list.findOne({ name:listname }).then(function(foundList){
      foundList.items.push(Item);
      foundList.save();
      res.redirect("/" + listname);
    })
    .catch({
      function(err) {
        console.log(err);
      },});}}
      //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
      //delete
      );
      
      //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
      //getting the url we type
      app.get("/:customListName", function (req, res) {
        const customListName =_.capitalize( req.params.customListName);
        list
        //find wether the page that name exists
        .findOne({ name: customListName })
        .then(function (foundList) {
          //if no then create a page of that name and add default objects to the array of model
          //creating a object of list model(page) which contains objects of item model(tasks)
          if (!foundList) {
            console.log("doesn't exist");
            const List = new list({
              name: customListName,
              item: defaultItems,
            });
            List.save();
            res.redirect("/" + customListName);
          } else {
            res.render("list", {listTitle: foundList.name,newListItems:foundList.items });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      })
      
      //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
      app.post("/delete",function (req, res) {
        //getting the status of the checkbox(getting its id )(to identify amongst all the checkbox)
        const checkeditemid = req.body.checkbox;
        const listnname= req.body.lastname;
        //then finding object with its id and removing it from array
        if(listnname ==="Today"){
          item.findByIdAndRemove(checkeditemid)
          .then(function () {
            
            res.redirect("/")
          })
    .catch(function (err) {
      console.log(err);
    });
    }
    else{
     

    list.findOneAndUpdate({name:listnname},{$pull:{items: {_id: checkeditemid}}}).then(function(err,foundList){
    
      console.log("not today")
      res.redirect("/"+listnname);
      
    
  }).catch(function(err) {
    if(err){
      console.log(err)
      res.redirect("/");
      }
      
    })
    }
  })

      app.get('/about',function (req,res) {
        res.render('about')
        
      })
let port = process.env.PORT;
if(port==null ||port=""){
  port=3000
}
      
      app.listen(3000, function () {
        console.log("Server started on port 3000");
      });
