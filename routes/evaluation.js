import express from "express";
import prisma from "../DB/db.config.js";
const router = express.Router();

async function checkExistence(id) {
    const evaluation = await prisma.evaluation.findUnique({
        where: { eval_id: id }
    });
    return evaluation !== null;
}

router.get("/", async (req, res) => {
    try {
        const evaluations = await prisma.evaluation.findMany();
        res.json(evaluations);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const evaluation = await prisma.evaluation.findUnique({
            where: { eval_id: id }
        });

        res.json(evaluation);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.evaluation.delete({
            where: { eval_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { avg_score, notes, interview_id, interviewer_id } = req.body;

    try {
        const newEvaluation = await prisma.evaluation.create({
            data: {
                total_avg_score: avg_score,
                eval_notes: notes,
                interview_id: interview_id,
                interviewer_id: interviewer_id
            }
        });

        res.json({ message: "Evaluation added successfully!", data: newEvaluation });
    } catch (error) {
        console.error("Error creating evaluation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { avg_score, notes, interview_id, interviewer_id } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.evaluation.update({
            where: { eval_id: id },
            data: {
                total_avg_score: avg_score,
                eval_notes: notes,
                interview_id: interview_id,
                interviewer_id: interviewer_id
            }
        });

        res.json({ message: "Record updated successfully!" });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
