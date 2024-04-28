import bodyParser from "body-parser";
import express from 'express';

import employeeRoutes from "./routes/employee.js";
import candidateRoutes from "./routes/candidate.js";
import interviewRoutes from "./routes/interview.js";
import jobPositionMasterRoutes from "./routes/jobPositionMaster.js";
import evalPointsMasterRoutes from "./routes/evaluationPointsMaster.js";
import evalPointsRoutes from "./routes/evaluationPoints.js";
import evalRoutes from "./routes/evaluation.js";
import interviewAssignRoutes from "./routes/interviewAssignment.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use("/employee", employeeRoutes);
app.use("/candidate", candidateRoutes);
app.use("/interview", interviewRoutes);
app.use("/interviewAssign", interviewAssignRoutes);
app.use("/jobPosMaster", jobPositionMasterRoutes);
app.use("/evalPtsMaster", evalPointsMasterRoutes);
app.use("/evalPts", evalPointsRoutes);
app.use("/evaluation", evalRoutes);

app.listen(PORT, () => console.log(`The server is running on: http://localhost:${PORT}`));
app.get("/", (req, res) => {
    res.send("Hello from home");
})