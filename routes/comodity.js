/**
 * Created by Dhanar J Kusuma on 12/02/2017.
 */
var express = require('express');
var router = express.Router();
var hargaCtrl = require('../controller/hargaController');


router.get('/grid/:page', hargaCtrl.getGridData);
router.get('/list/:page', hargaCtrl.getListData);
router.get('/detail/graph', hargaCtrl.getChart);

module.exports = router;