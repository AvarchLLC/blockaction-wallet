const express = require('express');
let router = express.Router();

router.get('/', (req,res) =>{
    console.log("Route set up successful")
} )

module.exports = router

