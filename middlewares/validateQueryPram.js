let validateQueryParm = async function(req, res, next) {
    if (!req.query.sort || !req.query.keyword || !req.query.stack) {
        res.json({code: -1, message: "조건(sort, keyword, stack)을 모두 입력해주세요"});
        return;
    }
    next();
}

module.exports = { validateQueryParm };