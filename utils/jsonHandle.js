let renameKey = async function (obj, oldKey, newKey){
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

let getBookMarkListRes = async function (obj){
    const articleList = obj.map(element =>{
        return {
            projectId : element._id,
            title : element.article.title,
            description : element.article.subjectDescription,
            stackList : element.article.stackList,
            capacity : element.article.capacity,
            view : element.article.view,
            bookMark : true,
            status : element.status,
            leader : {
                userId : element.leader._id,
                photo : element.leader.photo
            }
        }
    })
    return {"articleList" : articleList};
}

let getArticleListRes = async function (obj){
    console.log("res : ",obj);
    const articleList = obj.map(element =>{
        return {
            projectId : element._id,
            title : element.article.title,
            description : element.article.subjectDescription,
            stackList : element.article.stackList,
            capacity : element.article.capacity,
            view : element.article.view,
            bookMark : true,
            status : element.status,
            leader : {
                userId : element.leader._id,
                photo : element.leader.photo
            }
        }
    })
    return {"articleList" : articleList};
}

module.exports = {renameKey, getBookMarkListRes, getArticleListRes};
