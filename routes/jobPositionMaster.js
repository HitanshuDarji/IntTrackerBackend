import express from "express";
import prisma from "../DB/db.config.js";

const router = express.Router();

// Function to check existence
async function checkExistence(id) {
    const jobPosition = await prisma.job_Position_Master.findUnique({
        where: { pos_id: id }
    });
    return jobPosition !== null;
}

router.get("/", async (req, res) => {
    try {
        const jobPositions = await prisma.job_Position_Master.findMany();
        res.json(jobPositions);
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

        const jobPosition = await prisma.job_Position_Master.findUnique({
            where: { pos_id: id }
        });

        res.json(jobPosition);
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

        const deletedJobPosition = await prisma.job_Position_Master.delete({
            where: { pos_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { name, description, salary, start_date } = req.body;

    try {
        const newJobPosition = await prisma.job_Position_Master.create({
            data: {
                pos_name: name,
                pos_description: description,
                pos_salary: salary,
                pos_start_date: start_date
            }
        });

        res.json({ message: "Job position added successfully!", data: newJobPosition });
    } catch (error) {
        console.error("Error creating job position:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, salary, start_date } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedJobPosition = await prisma.job_Position_Master.update({
            where: { pos_id: id },
            data: {
                pos_name: name,
                pos_description: description,
                pos_salary: salary,
                pos_start_date: start_date
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedJobPosition });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
