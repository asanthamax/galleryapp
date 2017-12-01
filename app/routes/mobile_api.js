/**
 * Created by asantha on 6/2/2017.
 */
var User = require('../models/user');

var Story = require('../models/story');

var Customer = require('../models/customer');

var Magazines = require('../models/magazines');

var Layout = require('../models/layouts');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user){

    var token = jsonwebtoken.sign({

        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {

        expiresIn: 1440
    });
    return token;
}



module.exports = function(app, express, io, upload, fs){

    var api = express.Router();

    //chain of requests

    api.route('/').post(function(req,res){

        var user = new User({

            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        user.save(function (err, newUser) {

            console.log(err);
            if(err){

                res.send(err);
                return;
            }
            res.json({message: "New User Added Successfully"});
        })
    });

    api.route('/login').post(function(req,res){

        User.findOne({

            username: req.headers['username']
        }).select('password').exec(function (err,user) {

            if(err)
                throw err;

            if(!user){

                res.send({message: "Invalid User!"});
            }else if(user){

                // console.log("User:"+user);
                var validPassword = user.comparePasswords(req.headers['password']);
                //  console.log("Pass:"+validPassword);
                if(!validPassword){

                    res.send({message: "Invalid Password"});
                }else{

                    var token = createToken(user);
                    res.send({

                        success: true,
                        message: "Successfully logged in!",
                        token: token
                    });
                }
            }
        })
    });

    api.use(function(req,res,next){

        console.log("Client Application requesting the service...");
        var token = req.headers['x-access-token'];
        if(token){

            jsonwebtoken.verify(token,secretKey,function (err, decoded) {

                if(err){

                    res.status(403).send({success: false,message: "Invalid token!!!"});
                }else{

                    req.decoded = decoded;
                    next();
                }
            })
        }else{

            res.status(403).send({success: false,message: "No Token Provided!"});
        }
    });

    api.route('/save_customer').post(function (req, res) {

        //console.log(req.formData)
        console.log(req.body.first_name);
        var customer = new Customer({

            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            email: req.body.email,
            mobile: req.body.mobile,
            facebookUrl: req.body.fburl,
            twitterUrl: req.body.twitterurl,
            plusUrl: req.body.plusurl,
            description: req.body.description,
            profile_picture: req.body.profile_picture,
            cover_photo: req.body.cover_photo,
            layout: req.body.layout
        });
        customer.save(function (err, newCustomer) {

            if(err){

                res.send(err);
                return;
            }
            io.emit('customers', newCustomer);
            res.json({message: "success"});
        })
    })

    api.route('/edit_customer').post(function (req, res) {

        //console.log(req.formData)
        console.log(req.body.first_name);
        var cust_id = req.body.cus_id;
        console.log(cust_id);
        Customer.findOne({customerID: cust_id},function (err, customer) {

            if(err){

                res.send(err);
                return;
            }
            customer.update({

                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email : req.body.email,
                address : req.body.address,
                mobile : req.body.mobile,
                facebookUrl : req.body.facebookUrl,
                twitterUrl : req.body.twitterUrl,
                plusUrl : req.body.plusUrl,
                description: req.body.description,
                profile_picture: req.body.profile_picture,
                cover_photo: req.body.cover_photo,
                layout: req.body.layout
            },function (err) {

                if(err){

                    res.send(err);
                    return;
                }
                res.json({message: "successful"});
            })
        })
    })

    api.route('/find_conditional_customers').post(function (req, res) {

        Customer.find(req.body,function (err, customers) {

            if(err){

                res.send(err);
                return;
            }
            res.json(customers);
        })
    })

    api.route('/find_customer').get(function (req, res) {

        Customer.findOne({customerID: req.query.cus_id},function (err, customer) {

            if(err){

                res.send(err);
                return;
            }
            res.json(customer);
        })
    })

    api.route('/find_conditional_magazine').get(function(req, res){

        console.log(req.body);
        Magazines.findOne({magazineID: req.query.mag_id},function (err, magazine) {

            if(err){

                res.send(err);
                return;
            }
            console.log(magazine);
            res.send(magazine);
        })
    })


    api.get('/all_layouts',function (req, res) {

        Layout.find({},function (err, layouts) {

            if(err){

                res.send(err);
                return;
            }
            //    console.log(magazines);
            res.json(layouts);
        })
    })

    api.get('/layout_find',function(req, res){

        console.log(req.query);
        var layout_id = req.query.layout_id;
        console.log(layout_id);
        Layout.findOne({layoutID: layout_id},function(err,layout){

            console.log(layout);
            if(err){

                res.send(err);
                return;
            }
            res.json(layout);
        })
    })

    api.get('/all_magazines',function (req, res) {

        Magazines.find({},function (err, magazines) {

            if(err){

                res.send(err);
                return;
            }
            //    console.log(magazines);
            magazines.forEach(function(mag) {

               mag.cover_image = "https://weddingglance.herokuapp.com/app/uploads/"+mag.cover_image;
               mag.document = "https://weddingglance.herokuapp.com/app/uploads/"+mag.document;
            });
            res.json(magazines);
        })
    })

    api.get('/all_customers',function(req, res){

        Customer.find({},function(err, customers) {

            if(err){

                res.send(err);
                return;
            }
            customers.forEach(function(cus){

                cus.profile_picture = "https://weddingglance.herokuapp.com/app/uploads/"+cus.profile_picture;
                cus.cover_photo = "https://weddingglance.herokuapp.com/app/uploads/"+cus.cover_photo;
            })
            res.json(customers)
        })
    })

    api.get('/get_customer',function(req,res){

        /* Customer.find({subcategory: req.query.subcat},function(err,customers){

            if(err){

                res.send(err);
                return;
            }
            customers.forEach(function(cus){

                cus.profile_picture = "https://weddingglance.herokuapp.com/app/uploads/"+cus.profile_picture;
                cus.cover_photo = "https://weddingglance.herokuapp.com/app/uploads/"+cus.cover_photo;
            });
            res.json(customers);
        })*/

        var customers = []
        var count_tracker = 1;
        var total_track = 0;
        Layout.find({subcategory: req.query.subcat},function(err,layouts){

            if(err){

                res.send(err);
            }else{

                total_track = layouts.length
                layouts.forEach(function(layout) {

                    Customer.find({customerID: layout.customer},function(err, customer) {

                        if(err){

                            res.send(err)
                        }else{
                            customer.profile_picture = "https://weddingglance.herokuapp.com/app/uploads/" + customer.profile_picture
                            customer.cover_photo = "https://weddingglance.herokuapp.com/app/uploads/" + customer.cover_photo
                            customers.push(customer)
                            count_tracker++
                        }
                    })
                })
                if(count_tracker==total_track){

                    res.json(customers);
                }
            }
        })
    })

    api.get('/get_profile',function(req, res){

       // console.log(req.query);
        Customer.findOne({customerID: req.query.customer},function (err,customer) {

            if(err){

                res.send(err);
            }else{

                Layout.findOne({customer: customer.customerID},function(err, layout){

                    if(err){

                        res.send(err);
                    }else{

                        customer.profile_picture = "https://weddingglance.herokuapp.com/app/uploads/"+customer.profile_picture;
                        customer.cover_photo = "https://weddingglance.herokuapp.com/app/uploads/"+customer.cover_photo;
                        if(layout) {
                            customer.set('layout_profile',layout,{strict: false});
                        }
                        res.json(customer);
                    }
                })
            }
        })
    })

    api.get('/me', function(req, res){

        res.send(req.decoded);
    })

    return api
}
