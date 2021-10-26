const db = require('../db/mongodbCon.js');

function bookmarkAdd () {

    const bookmarkAdd = "INSERT INTO USER.bookmarkList VALUES (Project.id);";

    return bookmarkAdd
}


function bookmarkDelete () {

    const bookmarkDelete = "Delete USER.bookmarkList VALUES (Project.id);";
    

    return bookmarkDelete

    }

function bookmarkCntUp () {

    const bookmarkCntUp = "INSERT INTO USER.bookmarkList VALUES (Project.id);";

    return bookmarkCntUp
}

function bookmarkCntDown () {

    const bookmarkCntDown = "INSERT INTO USER.bookmarkList VALUES (Project.id);";

    return bookmarkCntDown
}


function bookmarkList() { 

    const bookmarkList = "select user.bookmarkList asc "

    return bookmarkList

}