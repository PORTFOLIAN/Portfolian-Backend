let validateQueryParm = async function(req, res, next) {
    if (!req.query.sort || !req.query.keyword || !req.query.stack) {
        return res.status(200).json({code: -1, message: "조건(sort, keyword, stack)을 모두 입력해주세요"});
    }
    next();
}

module.exports = { validateQueryParm };