var express= require("express");
var methodOverride=require("method-override");
var app    = express();
var mongoose= require("mongoose");
var bodyParser= require("body-parser");
var expressSanitizer=require("express-sanitizer");


// APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
var blogSchema= new mongoose.Schema({
   title : String,
   image : String,
    body : String,
created  : {type: Date, default: Date.now }
});

var Blog= mongoose.model("Blog", blogSchema);

// Blog.create({
//    title: "Test Blog",
//    image: "https://images.unsplash.com/photo-1529588386890-f5e8452163fb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a35eb694dae829d11b3c4ac3f99d557c&auto=format&fit=crop&w=1050&q=80",
//    body : "Hello This is a Blog Post",
   
// });

// RESTful-Routes

// INDEX route
app.get("/", function(req, res){
   res.redirect("/blogs");
});

// NEW route
app.get("/blogs/new", function(req, res){
   res.render("new");
});
// CREATE route
app.post("/blogs", function(req, res){
   console.log(req.body);
   // sanitize input
   req.body.blog.body=req.sanitize(req.body.blog.body);
   console.log("================");
    console.log(req.body);
   // create a blog
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
         res.render("new");
      } else{
         // redirect
         res.redirect("/blogs");
      }
   });
   
});

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      if(err){
         console.log(err);
      } else {
        res.render("index", {blogs:blogs}); 
      }
   });
   
});

// SHOW route
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
         res.redirect("/blogs");
      } else{
         res.render("show", {blog:foundBlog});
      }
   });
});

// EDIT route
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
         res.redirect("/blogs");
      } else{
         res.render("edit", {blog:foundBlog});
      }
   });
});

// UPDATE route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
         res.redirect("/blogs");
      } else {
         res.redirect("/blogs/"+ req.params.id);
      }
   });
});

// DELETE route

app.delete("/blogs/:id", function(req, res){
   // destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/blogs");
      } else{
        // redirect
       res.redirect("/blogs");
      }
   });
   
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started"); 
});