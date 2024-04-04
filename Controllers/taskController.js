const Task = require('../Models/taskModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const createTask = async (req, res) => {
    try {
        const { title, priority, checklist, dueDate } = req.body;
        const {userId} = req.body;

        // const token = req.headers.authorization;

        // const decodedToken = jwt.decode(token);

        // const userId = decodedToken.userId;

        if (!title || !priority || !checklist){
            return res.status(400).json({
                message: "Enter all details!",
                success: false
            })
        }

        const taskData = {
            title,
            section: 'todo',
            priority,
            checklist,
            refUserId: userId
        }

        if (dueDate) {
            taskData.dueDate = dueDate;
        }


        const newTask = new Task({ ...taskData });

        const response = await newTask.save();

        res.status(200).json({ message: "Task Added!", response });

    } catch (error) {
        console.log("Error : ", error);
    }
}

const getAllTasks = async (req, res) => {
    try {
        const { frequency } = req.query;
        const {userId} = req.body;

        // const token = req.headers.authorization;
        // const decodedToken = jwt.decode(token);
        // const userId = decodedToken.userId;
        let filter = { refUserId: userId };

        if (frequency) {
            filter.createdAt = {
                $gt: moment().subtract(frequency, 'd').toDate()
            };
        }

        const taskData = await Task.find(filter);

        if (taskData) {
            res.status(200).json(taskData);
        }

    } catch (error) {
        console.log(error);
    }
}


const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        const taskDetails = await Task.findById(taskId);
        res.status(200).json(taskDetails);
    } catch (error) {
        console.log(error);
    }

}


const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found!' });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted!', deletedTask });
    } catch (error) {
        console.log(error)
    }
}


const updateTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { title, priority, checklist, dueDate, section, itemId, itemChecked } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found!' });
        }

        if (itemId && itemChecked !== undefined) {
            const checklistItem = task.checklist.find(item => item._id.toString() === itemId);
            if (checklistItem) {
                checklistItem.checked = itemChecked;
            }
        }

        if (section) {

            if (section === 'done') {
                task.section = section;
                task.checklist.forEach(item => {
                    item.checked = true;
                });

                await task.save();
                return res.status(200).json(task);
            } else {
                task.section = section;
                await task.save();
                return res.status(200).json(task);
            }

        } else {
            if (title) {
                task.title = title;
            }

            if (priority) {
                task.priority = priority;
            }

            if (checklist) {
                task.checklist = checklist;
            }

            if (dueDate) {
                task.dueDate = dueDate;
            }



            await task.save();
            return res.status(200).json({ message: 'Task Updated!', task })
        }

    } catch (error) {
        console.log(error)
    }
}


module.exports = { createTask, getAllTasks, getTaskById, deleteTaskById, updateTaskById };
