import express from "express";
import prisma from "../DB/db.config.js";

const router = express.Router();

async function checkExistence(id) {
    const interview_Assignment = await prisma.interview_Assignment.findUnique({
        where: { inta_id: id }
    });
    return interview_Assignment !== null;
}

router.get("/", async (req, res) => {
    try {
        const interview_Assignments = await prisma.interview_Assignment.findMany();
        res.json(interview_Assignments);
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

        const interview_Assignment = await prisma.interview_Assignment.findUnique({
            where: { inta_id: id }
        });

        res.json(interview_Assignment);
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

        await prisma.interview_Assignment.delete({
            where: { inta_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { created_by, interviewer_id, interview_id } = req.body;

    try {
        const newInterview_Assignment = await prisma.interview_Assignment.create({
            data: {
                created_by: created_by,
                interviewer_id: interviewer_id,
                interview_id: interview_id
            }
        });

        res.json({ message: "Interview Assignment added successfully!", data: newInterview_Assignment });
    } catch (error) {
        console.error("Error creating interview assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { created_by, modified_by, interviewer_id, interview_id } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedInterview_Assignment = await prisma.interview_Assignment.update({
            where: { inta_id: id },
            data: {
                created_by: created_by,
                modified_date: new Date(),
                modified_by: modified_by,
                interviewer_id: interviewer_id,
                interview_id: interview_id
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedInterview_Assignment });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
