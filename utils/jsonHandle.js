let renameKey = async function (obj, oldKey, newKey){
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}
let changeStruct = async function (obj){
    await renameKey(obj,"bookMarkList","projectList")
    obj.projectList.forEach(element => {
        renameKey(element,"_id","projectId")
        element.title = element.article.title;
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
module.exports = {renameKey, changeStruct};