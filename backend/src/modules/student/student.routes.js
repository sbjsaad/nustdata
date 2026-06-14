import { Router } from "express";
import * as studentController from "./student.controller.js";

const router = Router();

router.get("/stats", studentController.getStudentStats);
router.post("/bulk-delete", studentController.bulkDeleteStudents);
router.get("/", studentController.getStudents);
router.get("/:cmsId", studentController.getStudentByCmsId);
router.post("/", studentController.createStudent);
router.put("/:cmsId", studentController.updateStudent);
router.delete("/:cmsId", studentController.deleteStudent);

export default router;
