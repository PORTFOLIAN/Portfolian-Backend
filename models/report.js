const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = mongoose.Schema(
    {
        srcUserId : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
        destUserId : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
        destProjectId : {type: mongoose.Schema.Types.ObjectId, ref : "Project"},
        reason : String,
        reportType : {
            type : String,
            enum : {
                values : ['USER', 'PROJECT']
            }
        }
    },
    {
		versionKey: false,
		timestamps: true,
        toObject: { virtuals: true },
    	toJSON: { virtuals: true }
	}
)

reportSchema.statics.createUserReport = async function (srcUserId, destUserId, reason) {
    let newReport = await new Report(
        {
            srcUserId : mongoose.Types.ObjectId(srcUserId),
            destUserId : mongoose.Types.ObjectId(destUserId),
            reason : reason,
            reportType : "USER"
        }
      ).save();
    return newReport.id;
}

reportSchema.statics.createProjectReport = async function (srcUserId, destProjectId, reason) {
    let newReport = await new Report(
        {
            srcUserId : mongoose.Types.ObjectId(srcUserId),
            destProjectId : mongoose.Types.ObjectId(destProjectId),
            reason : reason,
            reportType : "PROJECT"
        }
      ).save();
    return newReport.id;
}


const Report = mongoose.model("Report", reportSchema);
module.exports  = Report;