let validateArticleContents = async function(req, res, next) {
    req
    if (!articleDto.title)
        return res.status(200).json({code : -51, message : "title 정보를 입력해주세요."});
    else if (!req.body.article.stackList)
        return res.status(200).json({code : -52, message : "stackList 정보를 입력해주세요."});
    else if (req.body.article.stackList.length == 0)
        return res.status(200).json({code : -53, message : "stackList는 빈 배열이 될 수 없습니다."});
    else if (!req.body.article.subjectDescription)
        return res.status(200).json({code : -54, message : "subjectDescription 정보를 입력해주세요."});
    else if (!req.body.article.projectTime)
        return res.status(200).json({code : -55, message : "projectTime 정보를 입력해주세요."});
    else if (!req.body.article.condition)
        return res.status(200).json({code : -56, message : "condition 정보를 입력해주세요."});
    else if (!req.body.article.progress)
        return res.status(200).json({code : -57, message : "progress 정보를 입력해주세요."});
    else if (!req.body.article.capacity)
        return res.status(200).json({code : -58, message : "capacity 정보를 입력해주세요."});
    else if (req.body.article.capacity <= 0)
        return res.status(200).json({code : -59, message : "capacity는 0이상 정수로 입력해주세요."});
    next();
}

module.exports = { validateArticleContents };