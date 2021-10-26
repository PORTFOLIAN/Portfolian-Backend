// import mongoose from "mongoose";
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const userSchema = new Schema({
    
	userId : String,
	nickName : String,
	channel : String,
	email : String,
	description : String,
	photo : String,
	stackList : [String], //stackList
	doingProjectList :  [String], //project.id
	doneProjectList : [String], //project.id
	applyProjectList : [String], // project.id 
	bookMarkList : [String], // project.id
	github :String

  }
  
);




const user = mongoose.model("user", userSchema);

module.exports  = user;