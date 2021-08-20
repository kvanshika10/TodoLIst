const express=require('express');
const app=express();
const bodyParser=require('body-parser');
// to connect database with node js
const mongoose=require("mongoose");
//lodash
const _ =require("lodash");

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({
  extended: true
}));
// express does not recognize the static files so we keep it in public folder
app.use(express.static("public"));
app.use(express.json());
mongoose.connect("mongodb+srv://admin-vanshika:noddy123@cluster0.k4u4v.mongodb.net/todolistDB",{useNewUrlParser: true,useUnifiedTopology:true},function(err){
  if(err)
  console.log(err);
  else console.log("Success!")
})
const todolistSchema= new mongoose.Schema ({
     name:String
})

// singular and first letter capital
const Item= new mongoose.model("Item",todolistSchema);
const one=new Item ({
  name:"Welcome to our todolist!"
})
const two=new Item ({
  name:"Hit the + button to add a new Item"
})
const three=new Item({
  name:"<-- Hit this to delete an Item"
})
// insert three documents in your collections

// find in order to know all the documents of collections
const listSchema=new mongoose.Schema({
  name:String,
  Items:[todolistSchema]
})
const List=new mongoose.model("List",listSchema)

app.get('/',function(req,res){
  console.log(one);
  Item.find({},function(err,results){
    if(results.length===0){
    Item.insertMany([one,two,three],function(err){
      if(err)
      console.log(err)

      res.redirect("/")
    })
  }else{
     res.render('list',{listTitle:"Today",listItem:results});
  }

})
});
app.post("/",function(req,res){
  //console.log(req.body);
  const itemName=req.body.newItem
  const item= new Item({
    name:itemName
  });
  if(req.body.list==="Today"){
      item.save();
     res.redirect("/")
}else{
List.findOne({name:req.body.list},function(err,results){
  results.Items.push(item)
  results.save();
  console.log(results.Items)
  res.redirect("/"+req.body.list)

})

   }
})
app.post("/delete",function(req,res){
console.log(req.body);
const listName=req.body.listName
  if(listName==="Today"){

  Item.deleteOne({ _id: req.body.checkbox }, function (err) {
  if(err) console.log(err);
  console.log("Successful deletion");

});
res.redirect("/")
}else{
  List.findOneAndUpdate({name:listName},{$pull:{Items:{_id:req.body.checkbox}}},function(err,results){
  if(err) console.log(err);
  console.log("Successful deletion");
   });
res.redirect("/"+listName)

   }
})
app.get("/:work",function(req,res){
  List.findOne({name:_.capitalize(req.params.work)},function(err,results){

    if(!err&&results===null){
    const list=new List({
    name:_.capitalize(req.params.work),
    Items:[one,two,three]
  })

  list.save()
  res.redirect("/"+_.capitalize(req.params.work))
}else if(!err){

  res.render("list",{listTitle:results.name,listItem:results.Items})
}else console.log(err)


            })

})
app.post("/work",function(req,res){
  workList.push(req.body.newItem);
  res.redirect("/work");
})
app.listen(3000,function(req,res){
  console.log("Server started");
});
