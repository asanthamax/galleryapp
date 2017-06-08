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
	api.route('/')
		.post(function(req, res){
			
			var story = new Story({
				
				creator: req.decoded.id,
				content: req.body.content
			});
			story.save(function(err, newStory){
				
				if(err){
					
					res.send(err);
					return;
				}
				io.emit('story', newStory);
				res.json({message: "New Story Created!!!"})
			})
		})
		.get(function(req, res){
			

		});

	api.route('/signup').post(function(req,res){

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
	   var token = req.body.token || req.headers['x-access-token'];
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
            facebookUrl: req.body.facebookUrl,
            twitterUrl: req.body.twitterUrl,
            plusUrl: req.body.plusUrl,
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

    api.route('/remove_customer').post(function(req, res){

        fs.unlink('./public/app/uploads/'+req.body.old_cover_photo,function (err) {

            if(err){

                res.send(err);
                return;
            }
            fs.unlink('./public/app/uploads/'+req.body.old_profile_picture,function (err) {

                if(err){

                    res.send(err);
                    return;
                }
                Customer.find({customerID: req.body.cus_id}).remove().exec(function (err) {

                    if(err){

                        res.send(err);
                        return;
                    }
                    res.json({message: "success"});
                })
            })
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

    api.route('/upload_magazines').post(function (req, res) {

        var cover_image_name = "";
        var document_name="";
        var type="";
        upload(req,res,function (err) {

           // console.log(req.body);
            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.files[0].mimetype;
            console.log(field);
            if(field.indexOf("image") >= 0){

                cover_image_name = req.files[0].filename;
                console.log(req.files[0].filename);
                type = "image";
            }else {

                document_name = req.files[0].filename;
                type = "pdf";
            }
            res.json({cover_image: cover_image_name,document: document_name,status: "OK",error_code: 0,upload_type: type});
        });
    })

    api.route('/upload_layouts').post(function (req, res) {

        var image_name = "";
        upload(req,res,function (err) {

            // console.log(req.body);
            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.files[0].mimetype;
            console.log(field);
            if(field.indexOf("image") >= 0){

                image_name = req.files[0].filename;
                console.log(req.files[0].filename);
            }
            res.json({cover_image: image_name,status: "OK",error_code: 0});
        });
    })

    api.route('/update_upload_layout').post(function (req, res) {

        var image_name="";
        upload(req,res,function (err) {

            // console.log(req.body);
            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.files[0].fieldname;
            console.log(req.body.old_images);

            if(req.body.old_images && req.body.old_images !="") {

                var files_count = req.body.old_images.length;
                fs.unlink('./public/app/uploads/' + req.body.old_cover_photo, function (err) {

                    if (err) {

                        res.status(500).send(err);
                        return;
                    }

                })
            }
            cover_photo = req.files[0].filename;
            console.log(req.files[0].filename);
            res.json({cover_photo: cover_photo,profile_picture: profile_picture,status: "OK",error_code: 0});
        });

    })

    api.route('/save_layout').post(function(req,res){

        var layout = new Layout({

            customer: req.body.customer,
            layout_type: req.body.layout,
            category: req.body.category,
            subcategory: req.body.subcategory,
            expire_date: req.body.expire_date,
            images: req.body.images,
            video_url: req.body.video_url
        });
        layout.save(function(err,newLayout){

            if(err){

                res.send(err);
                return;
            }
            io.emit('layouts', newLayout);
            res.json({message: "success"});
        })
    })

    api.route('/edit_layout').post(function (req, res) {

        //console.log(req.formData)
        //console.log(req.query.first_name);
        var layout_id = req.query.layout_id;
        console.log(layout_id);
        Layout.findOne({layoutID: layout_id},function (err, layout) {

            if(err){

                res.send(err);
                return;
            }
            layout.update({

                customer: req.body.customer,
                layout: req.body.layout,
                category: req.body.category,
                subcategory: req.body.subcategory,
                expire_date: req.body.expire_date,
                images: req.body.images,
                video_url: req.body.video_url
            },function (err) {

                if(err){

                    res.send(err);
                    return;
                }
                res.json({message: "successful"});
            })
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


    api.route('/upload_customers').post(function (req, res) {

        var cover_photo = "";
        var profile_picture = "";
        upload(req,res,function (err) {

            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.body.type;
            if(field=="cover_photo"){

                cover_photo = req.files[0].filename;
            }else{

                profile_picture = req.files[0].filename;
            }
            res.json({cover_photo: cover_photo,profile_picture: profile_picture, status: "OK",error_code: 0});
        });
    })

    api.route('/update_customer_upload').post(function (req, res) {

        var cover_photo="";
        var profile_picture="";
        upload(req,res,function (err) {

            // console.log(req.body);
            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.files[0].fieldname;
            console.log(req.body.old_cover_photo);
            console.log(req.body.old_profile_picture);
            if(req.body.type == "cover_photo"){

                if(req.body.old_cover_photo && req.body.old_cover_photo !="") {
                    fs.unlink('./public/app/uploads/' + req.body.old_cover_photo, function (err) {

                        if (err) {

                            res.status(500).send(err);
                            return;
                        }

                    })
                }
                cover_photo = req.files[0].filename;
                console.log(req.files[0].filename);
            }
            else{

                if(req.body.old_profile_picture && req.body.old_profile_picture !="") {
                    fs.unlink('./public/app/uploads/' + req.body.old_profile_picture, function (err) {

                        if (err) {

                            res.status(500).send(err);
                            return;
                        }
                    })
                }
                profile_picture = req.files[0].filename;
                console.log(req.files[0].filename);
            }

            res.json({cover_photo: cover_photo,profile_picture: profile_picture,status: "OK",error_code: 0});
        });

    })

    api.route('/update_magazines_upload').post(function (req, res) {

        var cover_image_name="";
        var document_name="";
        var type="";
        upload(req,res,function (err) {

            // console.log(req.body);
            if(err){

                res.json({error_code: 1,err_desc: err});
                return;
            }
            var field = req.files[0].mimetype;
            console.log(field);
            if(field.indexOf("image") >= 0){

                fs.unlink('./public/app/uploads/'+req.body.old_image,function (err) {

                    if(err){

                        res.status(500).send(err);
                        return;
                    }

                })
                cover_image_name = req.files[0].filename;
                console.log(req.files[0].filename);
                type = "image";
            }
            else{

                fs.unlink('./public/app/uploads/'+req.body.old_document,function (err) {

                    if(err){

                        res.status(500).send(err);
                        return;
                    }
                })
                document_name = req.files[0].filename;
                console.log(req.files[0].filename);
                type = "pdf";
            }

            res.json({cover_image: cover_image_name,document: document_name,status: "OK",error_code: 0,upload_type: type});
        });

    })

    api.route('/add_magazines').post(function(req, res){

        var magazines = new Magazines({

            title: req.body.title,
            cover_image: req.body.cover_image,
            document: req.body.document,
            status: req.body.status
        });

        magazines.save(function (err, newMagazine) {

            if(err){

                res.send(err);
                return;
            }
            io.emit('magazines',newMagazine);
            res.json({error_code: 0,err_desc: null,message: "Magazine Saved Successfully"});
        });
    })

    api.route('/update_magazine').post(function (req, res) {

        var magazine_id = req.body.mag_id;
        Magazines.findOne({magazineID: magazine_id},function (err, magazine) {

            if(err){

                res.status(500).send(err);
                return;
            }
            magazine.update({

                title: req.body.title,
                status: req.body.status,
                cover_image: req.body.cover_image,
                document: req.body.document
            },function (err) {

                if(err){

                    res.send(err);
                    return;
                }
                res.json({message: "successful"});
            })
        })
    })

    api.route('delete_magazine').post(function(req, res){

        var magazine_id = req.body.mag_id;
        fs.unlink('./public/app/uploads/'+req.body.old_image,function (err) {

            if(err){

                res.send(err);
                return;
            }
            fs.unlink('./public/app/uploads/'+req.body.old_document,function (err) {

                if(err){

                    res.send(err);
                    return;
                }
                Magazines.find({magazineID: magazine_id}).remove().exec(function (err) {

                    if(err){

                        res.send(err);
                        return;
                    }
                    res.send({message: "magazine deleted successfully"});
                })
            })
        })
    })

    api.get('/all_magazines',function (req, res) {

        Magazines.find({},function (err, magazines) {

            if(err){

                res.send(err);
                return;
            }
        //    console.log(magazines);
            res.json(magazines);
        })
    })

    api.get('/all_customers',function(req, res){

        Customer.find({},function(err, customers) {

            if(err){

                res.send(err);
                return;
            }
            res.json(customers)
        })
    })

	api.get('/me', function(req, res){
		
		res.send(req.decoded);
	})

	return api
}