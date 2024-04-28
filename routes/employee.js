import express from "express";
import prisma from "../DB/db.config.js";

const router = express.Router();

// Function to check existence
async function checkExistence(id) {
    const employee = await prisma.employee.findUnique({
        where: { emp_id: id }
    });
    return employee !== null;
}

router.get("/", async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
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

        const employee = await prisma.employee.findUnique({
            where: { emp_id: id }
        });

        res.json(employee);
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

        const deletedEmployee = await prisma.employee.delete({
            where: { emp_id: id }
        });

        res.json({ message: "Record deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    const { name, position, username, password, status, type } = req.body;

    try {
        const newEmployee = await prisma.employee.create({
            data: {
                emp_name: name,
                emp_position: position,
                emp_username: username,
                emp_password: password,
                emp_status: status,
                emp_type: type
            }
        });

        res.json({ message: "Employee added successfully!", data: newEmployee });
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, position, username, password, status, type } = req.body;

    try {
        const exists = await checkExistence(id);
        if (!exists) {
            return res.status(404).json({ error: "Record not found" });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { emp_id: id },
            data: {
                emp_name: name,
                emp_position: position,
                emp_username: username,
                emp_password: password,
                emp_status: status,
                emp_type: type
            }
        });

        res.json({ message: "Record updated successfully!", data: updatedEmployee });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
