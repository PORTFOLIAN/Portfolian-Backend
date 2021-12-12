let renameKey = async function (obj, oldKey, newKey){
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}
let changeStruct2 = async function (obj){
    // await renameKey(obj,"readProject","project")
    console.log("+++++++++++확인 +++++++++++++")
    // const contents = Object.assign({}, obj.article);
    const contents =  { contents: obj.article };
    console.log(contents);

    return contents;
}


let changeStruct = async function (obj){
    await renameKey(obj,"bookMarkList","projectList")
    obj.projectList.forEach(element => {
        renameKey(element,"_id","projectId")
        element.title = element.article.title;
        //참고  element.leader.title = element.article.title;
        element.description = element.article.subjectDescription;
        element.stackList = element.article.stackList;
        element.capacity = element.article.capacity;
        element.view = element.article.view;
        element.bookMark = true;
        delete element.article;
    });
    delete obj._id;
    return obj;
}


module.exports = {renameKey, changeStruct, changeStruct2};