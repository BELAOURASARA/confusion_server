const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();

var authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());



favoriteRouter.route('/')
.options(cors.corsWithOptions,authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {

    Favorites.findOne({ "user" : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ "user" : req.user._id})
    .then((favorite)=>{
        if(favorite==null)
        { 
          Favorites.create({
                "user" : req.user._id,
              
            })
            .then((favorite) => {
              
                for (var i = (req.body.length -1); i >= 0; i--) {
                 
                    favorite.dishes.push(req.body[i]._id); 
                 }
                
                favorite.save()
                .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => 
                        {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
           
            },(err) => next(err))
            .catch((err) => next(err));
             });
             
        }
        else
        {
            Favorites.findOne({ "user" : req.user._id})
            .then((favorite)=>{
                for (var i = (req.body.length -1); i >= 0; i--) {
                    //test if the dish already exits in the list of favorites
                    exists =favorite.dishes.indexOf(req.body[i]._id);
                    if(exists==-1) 
                        //if it doesn't exist so the index is equal to -1 , so we should add the dish
                        {
                          favorite.dishes.push(req.body[i]._id);
                        }
                    else  
                        //if it exists so the index is greater than -1 , so we should'nt add the dish
                        {
                      
                           var err = new Error("The dish already exists in the favorites list");
                           err.status=403;
                           return next(err);
                        }
 
                 }
                
                favorite.save()
                .then((favorite) => {
                       
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes') 
                        .then((favorite) => 
                        {
                            console.log('Favorites added ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
           
                }, (err) => next(err))
                
                .catch((err) => next(err))});
                 
        }
    });
}) 
.put(cors.corsWithOptions,authenticate.verifyUser ,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ "user" : req.user._id})
    .then((favorite)=>{
        if(favorite==null) //the user has no favorites document yet
        {
           var err = new Error("Your favorite list is already empty");
           err.status=403;
           return next(err);
        }
        else
        {
            Favorites.remove({ "user" : req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

        }
    }).catch((err) => next(err));   
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ "user" : req.user._id})
    .then((favorite)=>{
        if(favorite==null)
        { 
          Favorites.create({
                "user" : req.user._id,
              
            })
            .then((favorite) => {
  
                favorite.dishes.push(req.params.dishId); 
                favorite.save()
                .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => 
                        {
                            console.log('Favorite added ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
           
            },(err) => next(err))
            .catch((err) => next(err));
             });
             
        }
        else
        {
            Favorites.findOne({ "user" : req.user._id})
            .then((favorite)=>{
               
                //test if the dish already exits in the list of favorites
                exists =favorite.dishes.indexOf(req.params.dishId);
                if(exists==-1) 
                    //if it doesn't exist so the index is equal to -1 , so we should add the dish
                    {
                      favorite.dishes.push(req.params.dishId);
                    }
                else  
                    //if it exists so the index is greater than -1 , so we should'nt add the dish
                    {
                       var err = new Error("The dish already exists in the favorites list");
                       err.status=403;
                       return next(err);
                    }
                
                favorite.save()
                .then((favorite) => {
                       
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes') 
                        .then((favorite) => 
                        {
                            console.log('Favorites added ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
           
                }, (err) => next(err))
                
                .catch((err) => next(err))});
                 
        }
    });
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
   
     Favorites.findOne({ "user" : req.user._id})
    .then((favorite)=>{
        
        if(favorite==null)
        { 
           var err = new Error("The Favorite list is already empty");
           err.status=403;
           return next(err);
        }
        else
        {
           //check if the dishId exists
           index =favorite.dishes.indexOf(req.params.dishId);
           if (index == -1) //the dish dosn't exist in the favorite list
           {
              var err = new Error("The dish " +req.params.dishId+" doesn't exist in the favorite list");
               err.status=403;
               return next(err);  
           }
           else //the dish exists in the list so we can delete it
           {
              favorite.dishes.splice(index,1);
              favorite.save()
                .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => 
                        {
                       
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
           
            },(err) => next(err))
           }

        } 
    })
    .catch((err) => next(err));

});




module.exports = favoriteRouter;

