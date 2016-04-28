// BASE SETUP
// =============================================================================

var express = require('express'),
bodyParser = require('body-parser');
var async = require('async');
var app = express();
app.use(bodyParser());


// IMPORT MODELS
// =============================================================================
var Sequelize = require('sequelize');

// initialize database connection
var sequelize = new Sequelize(process.env.dbschema,process.env.dbuser,process.env.dbpwd, {
  host: process.env.DATABASE_SERVICE_HOST,
  port: process.env.DATABASE_SERVICE_PORT,
  dialect: 'mysql',
  define: {timestamps: false}
});

var DataTypes = require("sequelize");

var AvailabilityZones = sequelize.define('availability_zones', {
    availabilityZone: DataTypes.STRING,
    active: DataTypes.BOOLEAN
}
);


var Events = sequelize.define('events', {
	idEvent: {type:DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
	cliente: {type:DataTypes.STRING},
	device: {type:DataTypes.STRING},
	severity: {type:DataTypes.TEXT},
	objectclass: {type:DataTypes.TEXT},
	object: {type:DataTypes.TEXT},
	message: {type:DataTypes.TEXT},
	horario: {type:DataTypes.TEXT}
});

var Actions = sequelize.define('actions', {
	idAction: {type:DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
	idEvent: {type:DataTypes.BIGINT},
	procedimiento: {type:DataTypes.TEXT},
	notificacion: {type:DataTypes.TEXT},
	llamada85: {type:DataTypes.TEXT},
	llamada247: {type:DataTypes.TEXT},
	asignacion: {type:DataTypes.TEXT}
});


Events.hasMany(Actions,{foreignKey: 'idEvent'})
Actions.belongsTo(Events,{foreignKey: 'idEvent'})

// IMPORT ROUTES
// =============================================================================
var router = express.Router();

// on routes that end in /prices
// ----------------------------------------------------
router.route('/actions')
// get all the actions for eventData(accessed at GET http://localhost:8080/actions)
.get(function(req, res) {
	if (req.query.idEvent){
		Events.findAll({
			where: {idEvent:req.query.idEvent},include:[Actions]
		}).then(function(events){
			if(events){
				res.json(events);
			}
			else{
				res.send(401,"No Events Found");
			}
		});
	}
	else{
		var model={}
		if (req.query.cliente) model.cliente=req.query.cliente
		if (req.query.device) model.device=req.query.device
		if (req.query.severity) model.severity=req.query.severity
		if (req.query.objectclass) model.cliente=req.query.objectclass
		if (req.query.object) model.cliente=req.query.object
		if (req.query.message) model.cliente=req.query.message
		if (req.query.horario) model.cliente=req.query.horario
		Events.findAll({
			where: model,include:[Actions]
		}).then(function(events){
			if(events){
				res.json(events);
			}
			else{
				res.send(401,"No Events Found");
			}
		});
	}
});

router.route('/actions')
// post event and data(accessed at POST http://localhost:8080/actions)
.post(function(req, res) {
	var model={}
	if (req.body.cliente) model.cliente=req.body.cliente
	if (req.body.device) model.device=req.body.device
	if (req.body.severity) model.severity=req.body.severity
	if (req.body.objectclass) model.objectclass=req.body.objectclass
	if (req.body.object) model.object=req.body.object
	if (req.body.message) model.message=req.body.message
	if (req.body.horario) model.horario=req.body.horario
	if (req.query.idEvent){
		Events.update(model,{where:{idEvent:req.query.idEvent}}).then(function (affected) {
			if (affected[0] == 0) {
				res.status(401).json("Event not found");
			} else {
				Actions.destroy({where:{idEvent:req.query.idEvent}}).then(function (){
					if (req.body.actions){
						req.body.actions.forEach(function(action){
							action.idEvent=req.query.idEvent
							Actions.create(action);
						});
					}
					res.status(200).json("Event updated");
				})
			}
		})
		.catch(function(err) {
			res.status(500).json(err);
		})
	}
	else{
		Events.create(model)
		.then(function (event) {
			if (req.body.actions){
					req.body.actions.forEach(function(action){
						action.idEvent=event.idEvent
						Actions.create(action);
					});
				}
			res.status(200).json("User created");
		})
		.catch(function(err) {
			res.status(500).json(err);
		})
	
	
	}
});


// Middleware to use for all requests
router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next();
});

// REGISTER OUR ROUTES
// =============================================================================
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(8080);

