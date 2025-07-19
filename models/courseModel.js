const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            default: ''
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        enrolledCount: {
            type: Number,
            default: 0
        },
        content: [
            {
                type: {
                    type: String,
                    enum: ['video', 'pdf', 'quiz'],
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
