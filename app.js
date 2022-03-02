require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const mongoose = require("mongoose");

const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//Create a person

const personSchema = {
    name : {
        type : String,
        required : [true]
    },
    age : Number,
    favoriteFoods : [String]
}

const Person = mongoose.model("Person",personSchema)

// Create and Save a Record of a Model

const personOne = new Person ({
    name : "Omar",
    age : 24,
    favoriteFoods : ["pasta", "lazania","burritos"]
})

personOne.save(function(err) {
    if(!err) {
        console.log("Success")
    }
})

// Create Many Records

const people = [
    {
        name : "Mounir",
        age : 32,
        favoriteFoods : ["pizza", "chicken","burritos"]
    },{
        name : "Aymen",
        age : 18,
        favoriteFoods : ["fish"]
    },{
        name : "Ahmed",
        age : 5,
        favoriteFoods : ["couscous", "Pasta", "pizza"]
    }
]

Person.create(people)

//Use model.find() to Search Your Database

app.route("/findall").get(function(req,res) {
    Person.find(function(err,data) {
        if(!err) {
            res.send(data)
        } else {
            res.send(err)
        }
    })
})

//Use model.findOne()

app.route("/findone/:food").get(function(req,res) {
    Person.findOne({ favoriteFoods : req.params.food },function(err,data) {
        if(!err) {
            res.send(data)
        } else {
            res.send(err)
        }
    })
})

//Use model.findById()

app.route("/findbyid/:id").get(function(req,res) {
    Person.findOne({ _id : req.params.id },function(err,data) {
        if(!err) {
            
            res.send(data)
        } else {
            res.send(err)
        }
    })
})

//Perform Classic Updates by Running Find, Edit, then Save


app.route("/addhamburger/:id").patch(function(req,res) {
    Person.findOne({ _id : req.params.id },function(err,data) {
        if(!err) {
            
            data.favoriteFoods.push("hamburger")
            data.save()
            res.send("hamburger added")
        } else {
            res.send(err)
        }
    })
})

//Perform New Updates on a Document Using model.findOneAndUpdate()


app.route("/age20/:id").put(function(req,res) {
    Person.findOneAndUpdate({ _id : req.params.id },{$set : {age : 20}},function(err) {
        if(!err) {
            
            res.send("ok")
        } else {
            res.send(err)
        }
    })
})

//Delete One Document Using model.findByIdAndRemove


app.route("/remove/:id").delete(function(req,res) {
    Person.findOneAndRemove({ _id : req.params.id },function(err) {
        if(!err) {
            
            res.send("deleted")
        } else {
            res.send(err)
        }
    })
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()


app.route("/removebyname/:name").delete(function(req,res) {
    Person.remove({ name : req.params.name },function(err) {
        if(!err) {
            
            res.send("deleted by name")
        } else {
            res.send(err)
        }
    })
})

//Chain Search Query Helpers to Narrow Search Results

app.route("/siblings") .get(function(req, res) {
    Person.find({ favoriteFoods: "burritos" })
      .sort({ name: "asc" })
      .limit(2)
      .select("-age")
      .exec(function(err, data) {
        if(!err) {
            res.send(data)
        } else {
            res.send(err)
        }
      })
  })



app.listen(process.env.port, function() {
    console.log("Server started on port " + process.env.port);
  });

