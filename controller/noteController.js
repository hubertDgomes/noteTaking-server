import noteSchema from "../model/note.js";


const createNote = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newNote = await noteSchema({
            title,
            content,
            owner: userId
        });

        await newNote.save();

        return res.status(201).json({
            message: "Note created successfully",
            note: newNote
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const getUserNotes = async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {

        const total = await noteSchema.countDocuments({ owner: userId });


        const notes = await noteSchema
            .find({ owner: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'name email');

        return res.status(200).json({
            message: "User notes fetched successfully",
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            notes
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const getAllNotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        const total = await noteSchema.countDocuments();

        const notes = await noteSchema
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'name email role');

        return res.status(200).json({
            message: "All notes fetched successfully",
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            notes
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getNote = async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const note = await noteSchema.findById(noteId).populate('owner', 'name email');

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (userRole !== 'admin' && note.owner._id.toString() !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json({
            message: "Note fetched successfully",
            note
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    try {
        const note = await noteSchema.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }


        if (note.owner.toString() !== userId) {
            return res.status(403).json({ message: "You can only update your own notes" });
        }
        if (title) note.title = title;
        if (content) note.content = content;

        await note.save();

        return res.status(200).json({
            message: "Note updated successfully",
            note
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const deleteNote = async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user.id;

    try {
        const note = await noteSchema.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.owner.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own notes" });
        }

        await noteSchema.findByIdAndDelete(noteId);

        return res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    createNote,
    getUserNotes,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote
};
