import { asyncHandler } from "../../utils/asyncHandler.js";
import * as studentService from "./student.service.js";

export const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({ success: true, data: student });
});

export const getStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getStudents(req.query);
  res.json({ success: true, data: result });
});

export const getStudentByCmsId = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentByCmsId(req.params.cmsId);
  res.json({ success: true, data: student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.cmsId, req.body);
  res.json({ success: true, data: student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  await studentService.deleteStudent(req.params.cmsId);
  res.json({ success: true, message: "Student deleted successfully" });
});

export const getStudentStats = asyncHandler(async (req, res) => {
  const stats = await studentService.getStudentStats();
  res.json({ success: true, data: stats });
});
