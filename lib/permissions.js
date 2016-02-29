// check that use userId specified owns the document

ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}