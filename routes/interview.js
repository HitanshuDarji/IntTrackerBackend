import express from "express";
import prisma from "../DB/db.config.js";

const router = express.Router();

async function checkExistence(id) {
    const interview = await prisma.interview.findUnique({
        where: { int_id: id }
    });
    return interview !== null;
}

router.get("/", async (req, res) => {
    try {
        const interviews = await prisma.interview.findMany();
        res.json(interviews);
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

        const interview = await prisma.interview.findUnique({
            where: { int_id: id }
        });

        res.json(interview);
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

        await prisma.interview.delete({
            where: { int_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { type, date_time, medium, created_by, candidate_id, position_id } = req.body;

    try {
        const newInterview = await prisma.interview.create({
            data: {
                int_type: type,
                int_date_time: date_time,
                int_medium: medium,
                created_by: created_by,
                candidate_id: candidate_id,
                position_id: position_id
            }
        });

        res.json({ message: "Interview added successfully!", data: newInterview });
    } catch (error) {
        console.error("Error creating interview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { type, date_time, medium, created_by, candidate_id, position_id, modified_by } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedInterview = await prisma.interview.update({
            where: { int_id: id },
            data: {
                int_type: type,
                int_date_time: date_time,
                int_medium: medium,
                created_by: created_by,
                candidate_id: candidate_id,
                position_id: position_id,
                modified_date: new Date(),
                modified_by: modified_by
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedInterview });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
