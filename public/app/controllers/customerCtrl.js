/**
 * Created by asantha on 3/22/2017.
 */
angular.module('customerCtrl',['customerService'])

    .controller('CustomerController',function ($location,Upload, Customer, cussocketio) {

        var vm = this;
        var file_add = false;
        var requestData={
            first_name: "",
            last_name: "",
            Address: "",
            Email: "",
            Mobile: "",
            fburl: "",
            twitterurl: "",
            plusurl: "",
            layout: "",
            description: "",
            cover_photo: "",
            profile_picture: ""
        };
        var cover_photo_add = false;
        var profile_picture = false;
        //vm.customers = [];
        Customer.all_customers()
            .then(function (data) {

                vm.customers = data.data;
            })

        vm.create_customer = function () {

            vm.save_cutomer_files(vm.cover_photo, "cover_photo");
            vm.save_cutomer_files(vm.profile_picture, "profile_picture");
        }

        vm.save_cutomer_files = function (file,type) {

            Upload.upload({

                url: 'http://localhost:3000/api/upload_customers',
                data:{file: file,type: type}
            }).then(function (resp) {

                if(resp.data.error_code == 0){

                    console.log("'Success "+resp.config.data.file.name+' uploaded. Response:');
                    if(type == "cover_photo") {
                        console.log(resp.data.cover_photo);
                        requestData.cover_photo = resp.data.cover_photo;
                        cover_photo_add = true;
                    }else {
                        console.log(resp.data.document);
                        requestData.profile_picture = resp.data.profile_picture;
                        profile_picture = true;

                    }
                    if(cover_photo_add && profile_picture){

                        vm.add_customer();
                    }
                }else{

                    console.log("An Error occurred");
                }
                console.log("document name:"+doc_name);
            },function(resp){

                console.log("Error status:"+resp.status);
                console.log("Error status:"+resp.status);
            },function (evt) {

                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        }

        vm.add_customer = function () {

            requestData.first_name = vm.formData.first_name;
            requestData.last_name = vm.formData.last_name;
            requestData.address =  vm.formData.address;
            requestData.email =  vm.formData.email;
            requestData.mobile = vm.formData.mobile;
            requestData.facebookUrl = vm.formData.fburl;
            requestData.twitterUrl = vm.formData.twitterurl;
            requestData.plusUrl =  vm.formData.plusurl;
            requestData.description = vm.formData.description;
            Customer.add_customer(requestData)
                .then(function(data)
                    {
                        vm.formData = '';
                        vm.message = data.data.message;
                        console.log(vm.message);
                        $location.url('/customers');
                    }
                )
                .catch(function (fallback) {

                    console.log(fallback);
                })
        }

        cussocketio.on('customer',function (data) {

            vm.customers.push(data);
            vm.dropdown_data.push(data);
            console.log('customer added...')
        })
    })

    .controller('AllCustomersController',function(customers, cussocketio){

       var vm = this;
       vm.customers = customers.data;
       console.log(vm.customers);
       cussocketio.on('customer',function (data) {

           vm.customers.push(data);
           console.log('customer refresh...')
       })
    })

    .controller('CustomerFindController',function (Customer, cussocketio, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.editCutomer = function() {
            Customer.find_customers(vm.formData)
                .then(function (data) {

                    var cust_dataload = JSON.stringify(data.data);
                    console.log(cust_dataload);
                    vm.dtOptions = DTOptionsBuilder.fromSource(cust_dataload)
                        .withPaginationType('full_numbers');
                    vm.dtColumns = [
                        DTColumnBuilder.newColumn('first_name').withTitle('First Name'),
                        DTColumnBuilder.newColumn('last_name').withTitle('Last name'),
                        DTColumnBuilder.newColumn('address').withTitle('Address'),
                        DTColumnBuilder.newColumn('mobile').withTitle('Mobile'),
                        DTColumnBuilder.newColumn('email').withTitle('Email')
                    ];
                })
                .catch(function (fallback) {

                    console.log(fallback);
                })
        };
        Customer.all_customers()
            .then(function (data) {

                vm.dropdown_data = data.data;
            })
            .catch(function(fallback){

                console.log(fallback);
            })
        cussocketio.on('customer',function(data){

            vm.dropdown_data.push(data);
        })
    })


    .controller('EditCustomerController',['$location','$scope','Upload','$routeParams','Customer',function ($location,$scope,Upload, $routeParams, Customer) {

        var vm = this;
        vm.stat = $routeParams.status;
        var para={};
        var status_upload_profile_edit = false;
        var status_upload_cover_edit = false;
        para.cus_id = $routeParams.id;
        Customer.get_customer(para)
            .then(function (data) {

                vm.customer_data = data.data;

                vm.customer_data.cus_id = $routeParams.id;
                vm.customer_data.status = $routeParams.status;
                console.log(vm.customer_data);
                if(vm.stat=='view'){

                    vm.button_text = "OK";
                }else{

                    vm.button_text = vm.stat+" customer";
                }
                console.log(vm.customer_data);
            })
            .catch(function (fallback) {

                console.log(fallback);
            })

        vm.update_customer = function(){

            var status = vm.customer_data.status;
            console.log(status);
            vm.customer_edit = Object.assign({},vm.customer_data,vm.formData);
            delete vm.customer_edit.action;
            console.log(vm.cover_photo);
            console.log(vm.profile_picture);
            if(status=='update'){

                if(vm.cover_photo)
                    vm.save_customer(vm.cover_photo,"cover_photo");
                if(vm.profile_picture)
                    vm.save_customer(vm.profile_picture,"profile_picture");
                if(!vm.cover_photo && !vm.profile_picture){

                    console.log("not profile or cover photo");
                   // console.log(vm.customer_edit);
                  //  vm.customer_edit.facebookUrl = vm.customer_edit.fburl;
                  //  vm.customer_edit.twitterUrl = vm.customer_edit.twitterurl;
                  //  vm.customer_edit.plusUrl = vm.customer_edit.plusurl;
                    Customer.edit_customer(vm.customer_edit)
                        .then(function(data)
                            {
                                vm.formData = '';
                                vm.message = data.data.message;
                                console.log(vm.message);
                                $location.url('/customers');
                            }
                        )
                        .catch(function (fallback) {

                            console.log(fallback);
                        })
                }

            }else if(status=='delete'){

                Customer.delete_customer(vm.customer_data)
                    .then(function(data)
                        {
                            vm.formData = '';
                            vm.message = data.data.message;
                            console.log(vm.message);
                            $location.url('/magazines');
                        }
                    )
                    .catch(function (fallback) {

                        console.log(fallback);
                    })
            }else{

                $location.url('/customers');
            }
        }

        vm.save_customer = function (file, type) {

            console.log("file upload called");
            Upload.upload({

                url: 'http://localhost:3000/api/update_customer_upload',
                data:{file: file,old_cover_photo: vm.customer_data.old_cover_photo,old_profile_picture: vm.customer_data.old_profile_picture,type: type}
            }).then(function (resp) {

                if(resp.data.error_code == 0){

                    console.log("'Success "+resp.config.data.file.name+' uploaded. Response:');
                    if(type == "cover_photo") {
                        console.log(resp.data.cover_image);
                        vm.customer_edit.cover_photo = resp.data.cover_photo;
                        status_upload_cover_edit = true;
                    }else{
                        console.log(resp.data.document);
                        vm.customer_edit.profile_picture = resp.data.profile_picture;
                        status_upload_profile_edit = true;
                    }
                    if(status_upload_cover_edit || status_upload_profile_edit){

                        console.log(vm.customer_edit);
                        Customer.edit_customer(vm.customer_edit)
                            .then(function(data)
                                {
                                    vm.formData = '';
                                    vm.message = data.data.message;
                                    console.log(vm.message);
                                    $location.url('/customers');
                                }
                            )
                            .catch(function (fallback) {

                                console.log(fallback);
                            })
                    }
                }else{

                    console.log("An Error occurred");
                }
                console.log("document name:"+doc_name);
            },function(resp){

                console.log("Error status:"+resp.status);
                console.log("Error status:"+resp.status);
            },function (evt) {

                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });

        }
    }]);