import express from "express";
import prisma from "../DB/db.config.js";
const router = express.Router();

async function checkExistence(id, tableName) {
    const record = await prisma[tableName].findUnique({
        where: { evalpt_id: id }
    });
    return record !== null;
}

router.get("/", async (req, res) => {
    try {
        const evaluationPoints = await prisma.evaluation_Points_Master.findMany();
        res.json(evaluationPoints);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:evalpt_id", async (req, res) => {
    const evalpt_id = parseInt(req.params.evalpt_id);

    try {
        const exists = await checkExistence(evalpt_id, 'evaluation_Points_Master');
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const evaluationPoint = await prisma.evaluation_Points_Master.findUnique({
            where: { evalpt_id: evalpt_id }
        });

        res.json(evaluationPoint);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:evalpt_id", async (req, res) => {
    const evalpt_id = parseInt(req.params.evalpt_id);

    try {
        const exists = await checkExistence(evalpt_id, 'evaluation_Points_Master');
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.evaluation_Points_Master.delete({
            where: { evalpt_id: evalpt_id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const evalpt_master = req.body;

    try {
        const newEvaluationPoint = await prisma.evaluation_Points_Master.create({
            data: {
                evalpt_type: evalpt_master.type,
                point: evalpt_master.point,
                position_id: evalpt_master.position_id
            }
        });

        res.json({ message: "Evaluation point added successfully!", data: newEvaluationPoint });
    } catch (error) {
        console.error("Error creating evaluation point:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:evalpt_id", async (req, res) => {
    const evalpt_id = parseInt(req.params.evalpt_id);
    const evalpt_master = req.body;

    try {
        const exists = await checkExistence(evalpt_id, 'evaluation_Points_Master');
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedEvaluationPoint = await prisma.evaluation_Points_Master.update({
            where: { evalpt_id: evalpt_id },
            data: {
                evalpt_type: evalpt_master.type,
                point: evalpt_master.point,
                position_id: evalpt_master.position_id
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedEvaluationPoint });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
