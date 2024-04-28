import express from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

async function checkExistence(id1, id2) {
    const evaluationPoint = await prisma.evaluation_Points.findUnique({
        where: {
            evaluation_id_evalpt_id: {
                evaluation_id: id1,
                evalpt_id: id2
            }
        }
    });
    return evaluationPoint !== null;
}

router.get("/", async (req, res) => {
    try {
        const evaluationPoints = await prisma.evaluation_Points.findMany();
        res.json(evaluationPoints);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id1/:id2", async (req, res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    try {
        const exists = await checkExistence(id1, id2);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const evaluationPoint = await prisma.evaluation_Points.findUnique({
            where: {
                evaluation_id_evalpt_id: {
                    evaluation_id: id1,
                    evalpt_id: id2
                }
            }
        });

        res.json(evaluationPoint);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:id1/:id2", async (req, res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    try {
        const exists = await checkExistence(id1, id2);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.evaluation_Points.delete({
            where: {
                evaluation_id_evalpt_id: {
                    evaluation_id: id1,
                    evalpt_id: id2
                }
            }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { eval_id, evalpt_id, status, score } = req.body;

    try {
        const newEvaluationPoint = await prisma.evaluation_Points.create({
            data: {
                evaluation_id: eval_id,
                evalpt_id: evalpt_id,
                evalpt_status: status,
                evalpt_score: score
            }
        });

        res.json({ message: "Evaluation point added successfully!", data: newEvaluationPoint });
    } catch (error) {
        console.error("Error creating evaluation point:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id1/:id2", async (req, res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);
    const { eval_id, evalpt_id, status, score } = req.body;

    try {
        const exists = await checkExistence(id1, id2);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.evaluation_Points.update({
            where: {
                evaluation_id_evalpt_id: {
                    evaluation_id: id1,
                    evalpt_id: id2
                }
            },
            data: {
                evaluation_id: eval_id,
                evalpt_id: evalpt_id,
                evalpt_status: status,
                evalpt_score: score
            }
        });

        res.json({ message: "Record updated successfully!" });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
