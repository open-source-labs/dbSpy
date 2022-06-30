


const controller = {};

controller.getAllSchemas = (req, res) => {

};
controller.getSchema = (req, res) => {
  
};
controller.openSchema = (req, res) => {
  
};
controller.postSchema = (req, res, next) => {
    console.log('I am in postSchema Controller');
    return next();
};
controller.saveSchema = (req, res) => {
  
};
controller.deleteSchema = (req, res) => {
  
};

module.exports = controller;