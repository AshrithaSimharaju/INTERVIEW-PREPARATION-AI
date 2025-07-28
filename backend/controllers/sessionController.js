const Session = require("../models/Session");
const Question = require("../models/Question");


// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("Error in createSession:", error.message);
    res.status(500).json({ success: false, message: "" });
  }
};







exports.getMySessions = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); // Confirming user data

    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");

    console.log("Fetched sessions:", sessions); // Optional

    res.status(200).json({ success: true, data: sessions }); // ✅ Correct response
  } catch (error) {
    console.error("Error in getMySessions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getOneSession = async (req, res) => {
  console.log("Fetching session:", req.params.id);
  try {
    const session = await Session.findById(req.params.id).populate("questions");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (error) {
    console.error("Error in getOneSession:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Error in getSessionById:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this session" });
    }

    // Delete all questions linked to the session
    await Question.deleteMany({ session: session._id });

    // Delete the session
    await session.deleteOne();

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSession:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// @desc    Delete all sessions and their questions
// @route   DELETE /api/sessions
// @access  Admin/Dev Only
exports.deleteAllSessions = async (req, res) => {
  try {
    console.log("Deleting all questions and sessions...");

    const qResult = await Question.deleteMany({});
    const sResult = await Session.deleteMany({});

    console.log("Questions deleted:", qResult.deletedCount);
    console.log("Sessions deleted:", sResult.deletedCount);

    res.status(200).json({ success: true, message: "All sessions and questions deleted" });
  } catch (error) {
    console.error("Error deleting all sessions:", error); // full error!
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
















// const Session = require("../models/Session");
// const Question = require("../models/Question");

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
//    exports.createSession = async (req, res) => {
//   try {
//     const { role, experience, topicsToFocus, description, questions } = req.body;
//     const userId = req.user._id;

//     if (!Array.isArray(questions)) {
//       return res.status(400).json({ success: false, message: "Questions must be an array" });
//     }

//     const session = await Session.create({
//       user: userId,
//       role,
//       experience,
//       topicsToFocus,
//       description,
//     });

//     const questionDocs = await Promise.all(
//       questions.map(async (q) => 
//         {
//         const question = await Question.create({
//           session: session._id,
//           question: q.question,
//           answer: q.answer,
//         });
//         return question._id;
//       })
//     );

//     session.questions = questionDocs;
//     await session.save();

//     const populatedSession = await Session.findById(session._id).populate("questions");

//     res.status(201).json({ success: true, data: populatedSession });
//   } catch (error) {
//     console.error("Error in createSession:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



// exports.createSession = async (req, res) => {
//   try {
//     const { userId, role, experience, topicsToFocus, description, questions } = req.body;

//     const session = await Session.create({
//       user: userId,
//       role,
//       experience,
//       topicsToFocus,
//       description,
//     });

//     const questionDocs = await Question.insertMany(
//       questions.map(q => ({
//         session: session._id,
//         question: q.question,
//         answer: q.answer || "",
//       }))
//     );

//     session.questions = questionDocs.map(q => q._id);
//     await session.save();

//     res.status(201).json({
//       message: "Session created",
//       sessionId: session._id,
//       questions: questionDocs,
//     });
//   } catch (err) {
//     console.error("Session creation error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };





// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
// exports.getMySessions = async (req, res) => {
//   try {
//     const sessions = await Session.find({ user: req.user._id })
//       .populate({
//         path: "questions",
//         options: { sort: { isPinned: -1, createdAt: 1 } },
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: sessions });
//   } catch (error) {
//     console.error("Error in getMySessions:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



// exports.getMySessions = async (req, res) => {
//   try {
//     console.log("REQ.USER:", req.user); // 👈 log this first

//     const sessions = await Session.find({ user: req.user._id })
//       .populate({
//         path: "questions",
//         options: { sort: { isPinned: -1, createdAt: 1 } },
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: sessions });
//   } catch (error) {
//     console.error("Error in getMySessions:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// // exports.getSessionById = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.id)
// //       .populate({
// //         path: "questions",
// //         options: { sort: { isPinned: -1, createdAt: 1 } },
// //       });

// //     if (!session) {
// //       return res.status(404).json({ success: false, message: "Session not found" });
// //     }

// //     // ✅ Return only required fields for frontend
// //     res.status(200).json({
// //       success: true,
// //       sessionId: session._id,
// //       role: session.role,
// //       experience: session.experience,
// //       topicsToFocus: session.topicsToFocus,
// //       description: session.description,
// //       questions: session.questions, // ✅ THIS is what frontend needs
// //     });
// //   } catch (error) {
// //     console.error("Error in getSessionById:", error.message);
// //     res.status(500).json({ success: false, message: "Server Error" });
// //   }
// // };

// // exports.getSessionById = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.id)
// //       .populate({
// //         path: "questions",
// //         options: { sort: { isPinned: -1, createdAt: 1 } },
// //       });

// //     if (!session) {
// //       return res.status(404).json({ success: false, message: "Session not found" });
// //     }

// //     res.status(200).json({ success: true, session });
// //   } catch (error) {
// //     console.error("Error in getSessionById:", error.message);
// //     res.status(500).json({ success: false, message: "Server Error" });
// //   }
// // };



// // @desc    Delete a session and its questions
// // @route   DELETE /api/sessions/:id
// // @access  Private


// exports.getSessionById = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id).populate("questions");
//     if (!session) return res.status(404).json({ error: "Session not found" });

//     res.json(session);
//   } catch (err) {
//     console.error("Error getting session", err);
//     res.status(500).json({ error: "Failed to fetch session" });
//   }
// };



// exports.deleteSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (session.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized to delete this session" });
//     }

//     // Delete all questions linked to the session
//     await Question.deleteMany({ session: session._id });

//     // Delete the session
//     await session.deleteOne();

//     res.status(200).json({ success: true, message: "Session deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteSession:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
// // @desc    Delete all sessions and their questions
// // @route   DELETE /api/sessions
// // @access  Admin/Dev Only
// exports.deleteAllSessions = async (req, res) => {
//   try {
//     console.log("Deleting all questions and sessions...");

//     const qResult = await Question.deleteMany({});
//     const sResult = await Session.deleteMany({});

//     console.log("Questions deleted:", qResult.deletedCount);
//     console.log("Sessions deleted:", sResult.deletedCount);

//     res.status(200).json({ success: true, message: "All sessions and questions deleted" });
//   } catch (error) {
//     console.error("Error deleting all sessions:", error); // full error!
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

















// const Session = require("../models/Session");
// const Question = require("../models/Question");
// const { openai } = require("../utils/openrouter"); // your setup

// // ✅ Create a new session
// exports.createSession = async (req, res) => {
//   try {
//     const { role, experience, topicsToFocus, description } = req.body;

//     const session = new Session({
//       user: req.user._id,
//       role,
//       experience,
//       topicsToFocus,
//       description,
//     });

//     await session.save();
//     res.status(201).json({ success: true, data: session });
//   } catch (err) {
//     console.error("Error in createSession:", err);
//     res.status(500).json({ success: false, message: "Failed to create session" });
//   }
// };

// // ✅ Get all sessions of logged-in user
// exports.getMySessions = async (req, res) => {
//   try {
//     const sessions = await Session.find({ user: req.user._id })
//       .populate({
//         path: "questions",
//         options: { sort: { isPinned: -1, createdAt: 1 } },
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: sessions });
//   } catch (err) {
//     console.error("Error in getMySessions:", err);
//     res.status(500).json({ success: false, message: "Failed to get sessions" });
//   }
// };

// // ✅ Get one session by ID
// exports.getSessionById = async (req, res) => {
//   try {
//     const session = await Session.findOne({ _id: req.params.id, user: req.user._id })
//       .populate({
//         path: "questions",
//         options: { sort: { isPinned: -1, createdAt: 1 } },
//       });

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Session not found" });
//     }

//     res.status(200).json({ success: true, data: session });
//   } catch (err) {
//     console.error("Error in getSessionById:", err);
//     res.status(500).json({ success: false, message: "Failed to get session" });
//   }
// };
