const tag = require('../models/tags')

const getTag = (req,res) => { // used for the tag page where the frontend retrieve all tags and display in boxes
    const tags = tag.find({});
    res.status(200).send(tags);
}

module.exports = {getTag}