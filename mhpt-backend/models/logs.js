const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    moodRatings: {
        type: Number,
        default: 0,
        max: 5,
        min: 0
    },
    anxietyLevel: {
        type: Number,
        default: 0,
        max: 5,
        min: 0
    },
    sleepPatterns: {
        type: Number,
        default: 0,
        max: 10,
        min: 0
    },
    physicalActivity: {
        type: String,
        default: null,
    },
    socialInteractions: {
        type: String,
        default: null,
    },
    stressLevels: {
        type: String,
        default: null,
    },
    symptomsDepressionAnxiety: {
        type: String,
        default: null,
    }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});

logsSchema.statics.createLog = function (log) {
    return this.create(log);
};

logsSchema.statics.fetchUserLogs = function (userId, fromDate, toDate) {
    return this.aggregate([
        {
            $match: {
                userId,
                createdAt: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }
            }
        },
        {
            $group: {
                // _id: {$week: '$createdAt'},
                moodRatings: { $avg: "$moodRatings" },
                anxietyLevel: { $avg: "$anxietyLevel" },
                sleepPatterns: { $avg: "$sleepPatterns" },
                physicalActivity: { $avg: "$physicalActivity" },
                socialInteractions: { $avg: "$socialInteractions" },
                stressLevels: { $avg: "$stressLevels" },
                symptomsDepressionAnxiety: { $avg: "$symptomsDepressionAnxiety" },
                _id: {
                    weekStart: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $subtract: [
                                    "$createdAt",
                                    { $multiply: [{ $dayOfWeek: "$createdAt" }, 24 * 60 * 60 * 1000] } // Adjust to get the week's start date
                                ]
                            }
                        }
                    },
                    weekEnd: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $subtract: [
                                    { $add: ["$createdAt", 6 * 24 * 60 * 60 * 1000] }, // Adjust to get week's end date (6 days after start)
                                    { $multiply: [{ $dayOfWeek: "$createdAt" }, 24 * 60 * 60 * 1000] }
                                ]
                            }
                        }
                    }
                }
            },
        },
        { $sort: { _id: 1 } }
    ]).exec();
};

logsSchema.statics.getAnalytics = function (userId) {
    return this.aggregate([
        {
            $match: {
                userId: userId
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfWeek: "$createdAt" } // Group by day of the week
                },
                moodRating: { $avg: "$moodRatings" }, // Average mood rating
                anxietyLevel: { $avg: "$anxietyLevel" }, // Average anxiety level
                sleepHours: { $avg: "$sleepPatterns" } // Average sleep hours
            }
        },
        {
            $sort: { "_id.day": 1 } // Sort by day of the week
        }
    ]).exec();
}


module.exports = mongoose.model('logs', logsSchema);
