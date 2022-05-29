const mongoose = require('mongoose');

class ReportService {

    constructor(UserModel, ProjectModel, ReportModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
        this.ReportModel = ReportModel;
    }

    // 사용자 신고글이 3개 이상인 경우 체크
    async checkUserReport(destUserId){
        let cntInfo = await this.ReportModel.getUserReportCnt(destUserId);
        console.log("cnt : ");
        console.log(cntInfo.reportCnt);
        if (cntInfo.reportCnt >= 3)
        {
            await this.UserModel.changeBan(destUserId);
        }
    }

    // 사용자 신고하기
    async createUserReport(srcUserId, destUserId, reason) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(srcUserId) || !ObjectId.isValid(destUserId) || !(await this.UserModel.isExistUserById(destUserId)))
            return {code : -1, message : "userId가 잘못되었습니다."};
        if (!reason)
            return {code : -3, message : "신고 사유를 입력해주세요."};
        if (srcUserId == destUserId)
            return {code : -4, message : "자신은 신고할 수 없습니다."};

        let under24HourReport = await this.ReportModel.findUserReportUnder24Hour(srcUserId, destUserId);
        if (under24HourReport.length !== 0)
            return {code : -5, message : "같은 사용자에 대해서 24시간에 한번만 신고가 가능합니다."};

        //  사용자 신고 생성
        let reportId = await this.ReportModel.createUserReport(srcUserId, destUserId, reason);
        this.checkUserReport(destUserId);

        return {code : 1, message : "사용자 신고가 성공적으로 처리되었습니다.", reportId : reportId};
    }

    // 프로젝트 신고글이 3개 이상인 경우 체크
    async checkProjectReport(destProjectId){
        let cntInfo = await this.ReportModel.getProjectReportCnt(destProjectId);
        if (cntInfo.reportCnt >= 3)
        {
            await this.ProjectModel.deleteProject(destProjectId);
        }
    }

    // 프로젝트 신고하기
    async createProjectReport(srcUserId, destProjectId, reason) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(srcUserId))
            return {code : -1, message : "userId가 잘못되었습니다."};
        if (!ObjectId.isValid(destProjectId) || !(await this.ProjectModel.isExistProjectById(destProjectId)))
            return {code : -2, message : "projectId가 잘못되었습니다."};
        if (!reason)
            return {code : -3, message : "신고 사유를 입력해주세요."};
        if ((await this.ProjectModel.isExistProjectByIdAndLeaderId(destProjectId, srcUserId)))
            return {code : -4, message : "자신의 프로젝트는 신고할 수 없습니다."};

        let under24HourReport = await this.ReportModel.findProjectReportUnder24Hour(srcUserId, destProjectId);
        if (under24HourReport.length !== 0)
            return {code : -5, message : "같은 프로젝트에 대해서 24시간에 한번만 신고가 가능합니다."};


        //  프로젝트 신고 생성
        let reportId = await this.ReportModel.createProjectReport(srcUserId, destProjectId, reason);
        this.checkProjectReport(destProjectId);

        return {code : 1, message : "프로젝트 신고가 성공적으로 처리되었습니다.", reportId : reportId};
    }
}
module.exports = ReportService;