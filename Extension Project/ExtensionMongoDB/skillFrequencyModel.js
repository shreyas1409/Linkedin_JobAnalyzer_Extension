const mongoose = require("mongoose");

const skillFrequencySchema = new mongoose.Schema({
    skill: String,
    frequency: Number,
});

const SkillFrequency = mongoose.model("SkillFrequency", skillFrequencySchema);

module.exports = SkillFrequency;
