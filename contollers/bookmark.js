const express = require('express');
const main = require('../models/main.js');



function bookmarkAdd (req, res, next) {

    try {
        //북마크 체크 검증?    main.bookmark


        res.send(true);
    
      } catch (error) {
        console.log(error);
        res.status(500).send({message:'북마크 체크 오류'});
      }
}



function bookmarkDelete (req, res, next) {

    try {
        //북마크 체크 검증?    main.bookmark


        res.send(true);
    
      } catch (error) {
        console.log(error);
        res.status(500).send({message:'북마크 체크 오류'});
      }
}


function bookmarkCnt (req, res, next) {

    try {
        //북마크 체크 검증?    main.bookmark

         
        res.send(true);
    
      } catch (error) {
        console.log(error);
        res.status(500).send({message:'북마크 체크 오류'});
      }
}



function bookmarkList (req, res, next) {

  
    main.bookmarkList


}