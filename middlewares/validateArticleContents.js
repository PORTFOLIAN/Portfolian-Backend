let validateArticleContents = async function(req, res, next) {
    if (!articleDto.title)
        return {code : -51, message : "title 정보를 입력해주세요."};
    else if (!req.body.article.stackList)
        return {code : -52, message : "stackList 정보를 입력해주세요."};
    else if (req.body.article.stackList.length == 0)
        return {code : -53, message : "stackList는 빈 배열이 될 수 없습니다."};
    else if (!req.body.article.subjectDescription)
        return {code : -54, message : "subjectDescription 정보를 입력해주세요."};
    else if (!req.body.article.projectTime)
        return {code : -55, message : "projectTime 정보를 입력해주세요."};
    else if (!req.body.article.condition)
        return {code : -56, message : "condition 정보를 입력해주세요."};
    else if (!req.body.article.progress)
        return {code : -57, message : "progress 정보를 입력해주세요."};
    else if (!req.body.article.capacity)
        return {code : -58, message : "capacity 정보를 입력해주세요."};
    else if (req.body.article.capacity <= 0)
        return {code : -59, message : "capacity는 0이상 정수로 입력해주세요."};
    next();
}

module.exports = { validateArticleContents };