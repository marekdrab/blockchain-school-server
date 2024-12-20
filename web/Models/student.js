const auth = require('../Auth/auth')
const infrastructure = require('../../fabcar/api/api.js');
const user_functions = require('./user');
const helpers = require('../Helpers/helpers');
var crypto = require('crypto')

module.exports = {
  getAllStudents: async function (req) {
    let users  = await user_functions.getAllUsers(req)
    let output = []
    for (id in users) {
      var user = users[id]
      if (user.user_type == 'student') {
        if ('study_programme_id' in user) {
          let programme = await infrastructure.getEntity('admin',user.study_programme_id)
          user.study_programme = programme
        }
        output.push(user)
      }
    }
    return output
  },
  getStudentByProgramId: function (req) {
    return 0
  },
  addStudent: async function (req) {
    if ('address' in req.body) {
      let address = req.body.address
      let result_address = await helpers.putAddress(address)
      let address_id = result_address._id
    } else { 
      let address_id = undefined
    }
    if ('study_programme' in req.body) {
      programme = await infrastructure.putEntity('admin', {
        entity_name:"study_programme",
        name:req.body.study_programme.name,
        acronym:req.body.study_programme.acronym,
      })    
    }
    if (req.body.password != null) {
      let password = req.body.password; 
      var hash = crypto.createHash('md5').update(password).digest('hex')
  } else {
      var hash = req.body.password
  }
    student = {
      user_type: "student",
      first_name : req.body.first_name,
      last_name : req.body.last_name,
      email : req.body.email,
      academic_degree : req.body.academic_degree,
      private_email : req.body.private_email,
      password: hash,
      bank_account: req.body.bank_account,
      address_id: address_id._id,
      study_programme_id: programme.data.id
    }
    let result = await infrastructure.createUser(student)
    student.id = result.id
    return student
  }
}