const Question = require("../models/Question");
const Session = require("../models/Session");

exports.addQuestionsToSession = async (req, res) => {

   try{
         const{sessionId,questions}=req.body;
         if(!sessionId || !questions || !Array.isArray(questions)){
          return res.status(400).json({message:"invalid"});
         }
         const session=await Session.findById(sessionId);
         if(!session){
             return res.status(400).json({message:"session not found"});
         }
         const createdQuestions=await Question.insertMany(
            questions.map((q)=>({
               session:sessionId,
               question:q.question,
               answer:q.answer,

            }))
         );
         session.questions.push(...createdQuestions.map((q)=>q._id));
         await session.save();
         res.status(201).json(createdQuestions);
   }
   catch (error) {
    console.error("Error adding questions to session:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.togglePinQuestion=async(req,res)=>{};
exports.updateQuestionNote=async(req,res)=>{};









