/**
 * Created by asantha on 3/26/2017.
 */
angular.module('magazineCtrl',['magazineService','ngFileUpload'])

    .controller('MagazineController',function ($location,Upload, Magazine, magsocketio) {

        var vm = this;
        var token = localStorage.getItem("access_web_token").toString();
        var status_upload_image = false;
        var status_upload_doc = false;
        var requestData={
            title: "",
            status: "",
            cover_image: "",
            document: ""
        };

        Magazine.all_magazines(token)
            .then(function (data) {

                vm.magazines = data.data;
                console.log(data);
            });

        vm.create_magazine = function () {

            vm.save_magazine(vm.cover_image);
            vm.save_magazine(vm.magazine);
        }
        
        vm.save_magazine = function (file) {

            Upload.upload({

                url: 'http://68.66.193.151/api/upload_magazines',
                headers: {'x-access-token' : token},
                data:{file: file}
            }).then(function (resp) {

                if(resp.data.error_code == 0){

                    console.log("'Success "+resp.config.data.file.name+' uploaded. Response:');
                    if(resp.data.upload_type == "image") {
                        console.log(resp.data.cover_image);
                        requestData.cover_image = resp.data.cover_image;
                        status_upload_image = true;
                    }else {
                        console.log(resp.data.document);
                        requestData.document = resp.data.document;
                        status_upload_doc = true;

                    }
                    if(status_upload_doc && status_upload_image){

                        vm.add_records_magazine();
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

        vm.add_records_magazine = function () {

            requestData.title = vm.title;
            requestData.status = vm.status;
            console.log(requestData);
            Magazine.add_magazine(requestData,token)
                .then(function (data) {

                    vm.message = data.data.message;
                    console.log(vm.message);
                    $location.url('/magazines');
                })
                .catch(function (log) {

                    console.log(log);
                })
        }

        magsocketio.on('magazine',function (data) {

            vm.magazines.push(data);
        })
    })

    .controller('EditMagazineController',['$location','$scope','Upload','$routeParams','Magazine',function ($location,$scope,Upload, $routeParams, Magazine) {

        var vm = this;
        var token = localStorage.getItem("access_web_token").toString();
        var status_upload_image_edit = false;
        var status_upload_doc_edit = false;
        vm.stat = $routeParams.status;
        var para={};
        para.mag_id = $routeParams.id;
        console.log(para);
        Magazine.get_magazine(para,token)
            .then(function (data) {

                vm.magazine_data = data.data;
                vm.magazine_data.mag_id = $routeParams.id;
                vm.magazine_data.action = $routeParams.status;
                if(vm.stat=='view'){

                    vm.button_text = "OK";
                }else{

                    vm.button_text = vm.stat+" magazine";
                }
                console.log(vm.magazine_data);
            })
            .catch(function (fallback) {

                console.log(fallback);
            })


        vm.update_magazine = function(){

            status = vm.magazine_data.action;
            console.log(status);
            vm.magazine_edit = Object.assign({},vm.magazine_data,vm.formData);
            delete vm.magazine_edit.action;
            console.log(vm.cover_image);
            console.log(vm.magazine);
            if(status=='update'){

                if(vm.cover_image)
                    vm.save_magazine(vm.cover_image);
                if(vm.magazine)
                    vm.save_magazine(vm.magazine);
                if(!vm.cover_image && !vm.magazine){

                    Magazine.edit_magazine(vm.magazine_edit,token)
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
                }

            }else if(status=='delete'){

                Magazine.delete_magazine(vm.magazine_data,token)
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

                $location.url('/magazines');
            }
        }

        vm.save_magazine = function (file) {

            Upload.upload({

                url: 'http://68.66.193.151/api/update_magazines_upload',
                headers: {'x-access-token' : token},
                data:{file: file,old_image: vm.magazine_data.cover_image,old_document: vm.magazine_data.document}
            }).then(function (resp) {

                if(resp.data.error_code == 0){

                    console.log("'Success "+resp.config.data.file.name+' uploaded. Response:');
                    if(resp.data.upload_type == "image") {
                        console.log(resp.data.cover_image);
                        vm.magazine_edit.cover_image = resp.data.cover_image;
                        status_upload_image_edit = true;
                    }else{
                        console.log(resp.data.document);
                        vm.magazine_edit.document = resp.data.document;
                        status_upload_doc_edit = true;
                    }
                    if(status_upload_doc_edit && status_upload_image_edit){

                        Magazine.edit_magazine(vm.magazine_edit)
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
