const path = require("path");

const express = require("express");

const methodOverride = require("method-override");

const app = express();

const dir = path.join(__dirname, 'public');


const bodyParser = require("body-parser");

const datakick = require('datakick');

const request = require("request");

const dotenv = require('dotenv');
dotenv.config();


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(dir));


app.use(methodOverride("_method"));

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

let userItems = [
	

]


app.get("/",(req,res)=>{

	let lat = 40.74337258642992;

	let long = -73.68065358043847;



	//take in material id from search page
	
	//"http://api.earth911.com/earth911.searchLocations?api_key=ced7f0cd743c0b5d&latitude=40.74337258642992&longitude=-73.68065358043847&material_id=60&max_distance=5"
	
	request("http://api.earth911.com/earth911.searchLocations?api_key="+ process.env.API_KEY +"&latitude=" + lat + "&longitude=" + long, (error,response,body) =>{


		
			if(!error && response.statusCode == 200){
				let recycleCenters = JSON.parse(body);
				//res.send(results["Search"][0]["Title"]);
				//res.render("results", {data: data});
				console.log(recycleCenters);
				res.render("home.ejs", {recycleCenters:recycleCenters});

			}



		});



	



});



app.get("/search", (req,res)=>{



	let searchTerm = req.query.searchTerm;

	console.log(searchTerm);
	if (searchTerm == undefined){
		res.render("search", {searchResults:[]});

	}
	else{

	

		request("http://api.earth911.com/earth911.searchMaterials?api_key="+ process.env.API_KEY +"&query=" + searchTerm, (error,response,body) =>{


			console.log(searchTerm);
			if(!error && response.statusCode == 200){
				let searchResults = JSON.parse(body);
				//res.send(results["Search"][0]["Title"]);
				//res.render("results", {data: data});
				console.log(searchResults);
				res.render("searchResults", {searchResults:searchResults});

			}



		});

	}


	
});


app.get("/item/:id", (req,res)=>{

	//this id is a upc code that can feed into earth911
	//now going to be material id
	let itemId = req.params.id;





	request("http://api.earth911.com/earth911.getMaterials?api_key="+ process.env.API_KEY , (error,response,body) =>{


		
			if(!error && response.statusCode == 200){
				let getResults = JSON.parse(body);
				//res.send(results["Search"][0]["Title"]);
				//res.render("results", {data: data});
				console.log(getResults);
				res.render("item", {getResults:getResults, itemId:itemId});

			}



		});

	/*

	datakick.item(item_id).then(itemData => {
  		console.log(JSON.stringify(itemData));
  		res.render("item", {itemData:itemData})
	}).catch(error => {
  		console.log(error.message);
  		res.render("item", {itemData:[]})
	});
	*/

	

});


app.put("/item/:id", (req,res)=>{

	//console.log(req.body.material_id);
	//console.log(req.body.description);
	//console.log(req.body.long_description);


	userItems.push({material_id:req.body.material_id,description:req.body.description,long_description:req.body.long_description, amount:1});

	res.redirect("/progress");

});


app.get("/progress",(req,res)=>{

	res.render("progress", {userItems:userItems});

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
  //https://stackoverflow.com/questions/27810419/git-push-heroku-master-is-still-asking-for-authentication
  //https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
});