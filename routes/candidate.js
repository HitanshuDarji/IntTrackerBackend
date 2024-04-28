import express from "express";
import prisma from "../DB/db.config.js";

const router = express.Router();

// Function to check existence
async function checkExistence(id) {
    const candidate = await prisma.candidate.findUnique({
        where: { cnd_id: id }
    });
    return candidate !== null;
}

router.get("/", async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany();
        res.json(candidates);
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

        const candidate = await prisma.candidate.findUnique({
            where: { cnd_id: id }
        });

        res.json(candidate);
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

        const deletedCandidate = await prisma.candidate.delete({
            where: { cnd_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { name, applied_position, experience, resume_stat, status, employee_id } = req.body;

    try {
        const newCandidate = await prisma.candidate.create({
            data: {
                cnd_name: name,
                cnd_applied_position: applied_position,
                cnd_experience: experience,
                resume_upload_status: resume_stat,
                cnd_status: status,
                created_by: employee_id,
                employee_id: employee_id
            }
        });

        res.json({ message: "Candidate added successfully!", data: newCandidate });
    } catch (error) {
        console.error("Error creating candidate:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, applied_position, experience, resume_stat, status, employee_id, modified_date, modified_by } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedCandidate = await prisma.candidate.update({
            where: { cnd_id: id },
            data: {
                cnd_name: name,
                cnd_applied_position: applied_position,
                cnd_experience: experience,
                resume_upload_status: resume_stat,
                cnd_status: status,
                created_by: employee_id,
                employee_id: employee_id,
                modified_date: modified_date,
                modified_by: modified_by
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedCandidate });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
