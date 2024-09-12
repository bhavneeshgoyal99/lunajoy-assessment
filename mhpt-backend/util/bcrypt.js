const { saltRounds, dataEncryptionKey } = require('../config/variables');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid'); 

const getUID = (tokenPreString) => uniqid(tokenPreString);

const processSecret = (password) => bcrypt.hashSync(password, saltRounds);

const checkSecret = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
    processSecret,
    checkSecret,
    getUID
}