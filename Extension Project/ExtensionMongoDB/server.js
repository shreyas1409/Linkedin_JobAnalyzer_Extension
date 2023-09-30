const express = require("express");
const mongoose = require("mongoose");
const SkillFrequency = require("./skillFrequencyModel");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = "mongodb+srv://shreyasjoshi149:hiremepls@csprojectextension.xcd8wjb.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        app.post("/store-skills", async (req, res) => {
            const skillsMap = req.body.skills;

            for (const skill in skillsMap) {
                const frequency = skillsMap[skill];

                let skillFrequency = await SkillFrequency.findOne({ skill });

                if (!skillFrequency) {
                    skillFrequency = new SkillFrequency({ skill, frequency });
                } else {
                    skillFrequency.frequency += frequency;
                }

                await skillFrequency.save();
            }

            res.status(200).json({ message: "Skills stored successfully" });
        });

        app.get("/get-skills", async (req, res) => {
            try {
                const skillFrequencies = await SkillFrequency.find().exec();
                const skillFrequencyMap = {};

                skillFrequencies.forEach((skillFrequency) => {
                    skillFrequencyMap[skillFrequency.skill] = skillFrequency.frequency;
                });

                res.status(200).json(skillFrequencyMap);
            } catch (error) {
                console.error("Error fetching skill frequencies:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        app.get("/retrieve-data", async (req, res) => {
            try {
                const db = client.db("test");
                const coll = db.collection("skillfrequencies");

                const data = await coll.find({}).toArray();
                const skillFrequencies = {};

                data.forEach(item => {
                    skillFrequencies[item.skill] = item.frequency;
                });

                res.status(200).json(skillFrequencies);
            } catch (error) {
                console.error("Error fetching skill frequencies:", error);
                console.error(error.stack);
                res.status(500).json({ error: "Internal server error" });
            }
        });
        



        app.delete("/delete-data", async (req, res) => {
            try {
                await SkillFrequency.deleteMany({});
                res.status(200).json({ message: "Data cleared successfully" });
            } catch (error) {
                console.error("Error clearing data:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        app.listen(8000, () => {
            console.log("Server started on port 8000");
        });
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
