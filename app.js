const path = require("path");

const express = require("express");

const app = express();

const dir = path.join(__dirname, 'public');


const bodyParser = require("body-parser");

const datakick = require('datakick');


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(dir));

app.set("view engine", "ejs");


//api integration here earth 911 zipcode
let recycleCenters = [
{name:"center1", location:"123 test"},
{name:"center2", location:"456 test"},
{name:"center3", location:"789 test"}

];


//api integration here earth 911 and upc code
/*let searchResults = [
{name:"item1", description:"123 test"},
{name:"item2", description:"456 test"},
{name:"item3", description:"789 test"}

];
*/


app.get("/",(req,res)=>{

	res.render("home.ejs", {recycleCenters:recycleCenters});



});


app.get("/progress",(req,res)=>{

	res.send("progress");

});

app.get("/search", (req,res)=>{



	let searchTerm = req.query.searchTerm;


	datakick.query(searchTerm).then(searchResults => {
  		//console.log(JSON.stringify(searchResults));
  		res.render("search", {searchResults:searchResults});
	}).catch(error => {
  		console.log(error.message);
  		res.render("search", {searchResults:[]});
	});

	
});


app.get("/item/:id", (req,res)=>{

	let item_id = req.params.id;

	datakick.item(item_id).then(data => {
  		console.log(JSON.stringify(data));
	}).catch(error => {
  		console.log(error.message);
	});

	res.send("show");

});

app.get("/local", (req,res)=>{

	res.send("local");
})

app.get("/login", (req,res)=>{

	res.send("login");
})

app.listen(process.env.PORT || 3000, ()=>{
  console.log("recycle express app");
  //https://frozen-cliffs-78336.herokuapp.com/
  //https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app
});