const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
    },
    checklist: [{
        name: { type: String, required: true },
        checked: { type: Boolean, default: false }
    }],
    dueDate: {
        type: Date,
        default: null
    },
    section: {
        type: String,
        enum: ['todo', 'backlog', 'inprogress', 'done'],
        required: true
    },
    refUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model('task', taskSchema);


