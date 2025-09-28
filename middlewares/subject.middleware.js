const Subject = require('../models/subject.model');


const subMiddleware = (req, res, next) => {
  const userId = req.user.id;
  console.log("User id: " + userId);
  Subject.GetId(userId, function(err, subject){
    console.log("Subject: " + subject);
    if(err) return res.status(500).json({ error: err.message });
    if(!subject) return res.status(500).json({ message: "L'id du sujet est introuvable" });

    req.subject = {
      id: subject.id
    }

    next();
  });
}


module.exports = subMiddleware;