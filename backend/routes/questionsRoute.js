import express from "express";
import { Question } from "../models/questionModel.js";

const router = express.Router();

// Route for Save a new Question
router.post("/", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.problemStatement ||
            !request.body.difficulty
        ) {
            return response.status(400).send({
                message:
                    "Send all required fields: title, author, problemStatement, difficulty",
            });
        }
        const newQuestion = {
            title: request.body.title,
            author: request.body.author,
            problemStatement: request.body.problemStatement,
            difficulty: request.body.difficulty,
            topics: request.body.topics,
        };

        const question = await Question.create(newQuestion);

        return response.status(201).send(question);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get All Questions from database
router.get("/", async (request, response) => {
    try {
        const questions = await Question.find({});

        return response.status(200).json({
            count: questions.length,
            data: questions,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get One Question from database by id
router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const question = await Question.findById(id);

        return response.status(200).json(question);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Update a Question
router.put("/:id", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.problemStatement ||
            !request.body.difficulty
        ) {
            return response.status(400).send({
                message:
                    "Send all required fields: title, author, problemStatement, difficulty",
            });
        }

        const { id } = request.params;

        const result = await Question.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: "Question not found" });
        }

        return response
            .status(200)
            .send({ message: "Question updated successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Delete a question
router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Question.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Question not found" });
        }

        return response
            .status(200)
            .send({ message: "Question deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
