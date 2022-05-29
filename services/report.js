const mongoose = require('mongoose');

class ReportService {

    constructor(UserModel, ProjectModel, ReportModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
        this.ReportModel = ReportModel;
    }

    // 사용자 신고하기
    async createUserReport(srcUsreId, destUserId, reason) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(srcUsreId) || !ObjectId.isValid(destUserId) || !(await this.UserModel.isExistUserById(destUserId)))
            return {code : -1, message : "userId가 잘못되었습니다."};
        
        let under24HourReport = await this.ReportModel.findUserReportUnder24Hour(srcUsreId, destUserId);
        console.log("under24HourReport");
        console.log(under24HourReport);

        let under24HourReport2 = await this.ReportModel.findUserReportUnder24Hour2(srcUsreId, destUserId);
        console.log("under24HourReport2");
        console.log(under24HourReport2);
        if (under24HourReport.length !== 0)
            return {code : -3, message : "같은 사용자에 대해서 24시간에 한번만 신고가 가능합니다."};

        //  사용자 신고 생성
        let reportId = await this.ReportModel.createUserReport(srcUsreId, destUserId, reason);

        return {code : 1, message : "사용자 신고가 성공적으로 처리되었습니다.", reportId : reportId};

    }

    // 프로젝트 신고하기
    async createProjectReport(srcUsreId, destProjectId, reason) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(srcUsreId))
            return {code : -1, message : "userId가 잘못되었습니다."};
        if (!ObjectId.isValid(destProjectId) || !(await this.ProjectModel.isExistProjectById(destProjectId)))
            return {code : -2, message : "projectId가 잘못되었습니다."};
        
        let under24HourReport = await this.ReportModel.findProjectReportUnder24Hour(srcUsreId, destProjectId);
        if (under24HourReport.length !== 0)
            return {code : -3, message : "같은 프로젝트에 대해서 24시간에 한번만 신고가 가능합니다."};

        //  프로젝트 신고 생성
        let reportId = await this.ReportModel.createProjectReport(srcUsreId, destProjectId, reason);

        return {code : 1, message : "프로젝트 신고가 성공적으로 처리되었습니다.", reportId : reportId};
    }
}
module.exports = ReportService;