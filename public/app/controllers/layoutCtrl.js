/**
 * Created by asantha on 4/1/2017.
 */
angular.module('layoutCtrl',['ngFileUpload','layoutService'])

    .controller('LayoutController',function ($location,$scope, Upload, Customer,Layout,laysocketio) {

        var vm = this;
        var token = localStorage.getItem('access_web_token').toString();
        vm.myDate = new Date();
        var uploaded_images = 0;
        var total_selected = 0;
        vm.isOpen = true;
        vm.requestData = {
          customer : "",
          layout : "",
          category : "",
          sub_category : "",
          expire_date : "",
          images : [],
          video_url : ""
        };
        $scope.categoryList = [

            {
                name: "Groom",
                value: "groom",
                subcategory:[
                    {
                        name: "Grooms Attire",
                        value: "grooms_attire"
                    },
                    {
                        name: "Footwear & Accessories",
                        value: "footwear"
                    },
                    {

                        name: "Salons",
                        value: "salons"
                    },
                    {

                        name: "Personal Care",
                        value: "personal_care"
                    }
                ]
            },
            {
                name: "Bride",
                value: "bride",
                subcategory:[
                    {
                        name: "Bridal Designer",
                        value: "bridal_designer"
                    },
                    {
                        name: "Bridal Wear & Fabrics",
                        value: "bridal_wear"
                    },
                    {
                        name: "Jewellery & Accessories",
                        value: "jewellery_accessories"
                    },
                    {
                        name: "Bridal Dressmakers",
                        value: "bridal_dressmakers"
                    },
                    {
                        name: "Bridal Flowers",
                        value: "bridal_flowers"
                    },
                    {
                        name: "Salons",
                        value: "salons"
                    },
                    {
                        name: "Cosmetics & Personal Care",
                        value: "cosmetics"
                    },
                    {
                        name: "Footwear",
                        value: "footwear"
                    }
                ]
            },
            {
                name: "Other",
                value: "other",
                subcategory:[
                    {
                        name: "Photography and Cinematography",
                        value: "photography"
                    },
                    {
                        name: "Hotels",
                        value: "hotels"
                    },
                    {
                        name: "Flowers and Decores",
                        value: "flowers_and_decores"
                    },
                    {
                        name: "Cakes & Invitations",
                        value: "cakes_and_invitations"
                    },
                    {
                        name: "Entertainment",
                        value: "entertainment"
                    },
                    {
                        name: "Poruwa Ceremony",
                        value: "poruwa_ceremony"
                    },
                    {
                        name: "Wedding Cars",
                        value: "wedding_cars"
                    },
                    {
                        name: "Wedding Gifts",
                        value: "wedding_gifts"
                    },
                    {
                        name: "Ashtaka Jayamangala Gatha",
                        value: "ashtaka_jayamangala_gatha"
                    },
                    {
                        name: "Magul Bera",
                        value: "magul_bera"
                    },
                    {
                        name: "Wes Natum",
                        value: "wes_natum"
                    },
                    {
                        name: "Locations",
                        value: "locations"
                    },
                    {
                        name: "Eventmanagements",
                        value: "eventmanagements"
                    },
                    {
                        name: "Travel & Destinations",
                        value: "travel"
                    }
                ]
            }
        ];

        Customer.all_customers(token)
            .then(function (data) {

                $scope.customers = data.data;
                //console.log($scope.customers);
            });

       vm.update_content = function(){

         $scope.maximum_images = vm.formData.layout_type;
         if($scope.maximum_images=='layout1'){

           $scope.image_msg = 'maximum 5 images can be uploaded';
         }else if($scope.maximum_images=='layout2'){

           $scope.image_msg = 'maximum 7 images can be uploaded';
         }else if($scope.maximum_images=='layout3'){

           $scope.image_msg = 'maximum 10 images can be uploaded';
         }else if($scope.maximum_images=='layout4'){

           $scope.image_msg = 'maximum 5 images can be uploaded';
         }else{

           $scope.image_msg = 'maximum 10 images can be uploaded';
         }
       };

       vm.create_layout = function(){

          //console.log(vm.formData);
          vm.requestData.customer = vm.formData.customer.customerID;
          vm.requestData.layout = vm.formData.layout_type;
          vm.requestData.category = vm.formData.category.value;
          vm.requestData.subcategory = vm.formData.subcategory.value;
          var date_con = new Date(vm.formData.expire_date.toISOString())
          vm.requestData.expire_date = date_con;
          vm.requestData.video_url = vm.formData.video;
          var fil = document.getElementById('nbr_images');
          var files_count = fil.files.length;
          for(var i=0;i<files_count;i++){

            vm.save_layout_image(fil.files[i],files_count);
          }
          console.log(vm.formData);
          console.log("Uploaded Images:"+uploaded_images);
          console.log("files count:"+files_count);

       };

       vm.save_layout_image = function (file,files_count) {

           Upload.upload({

               url: 'http://infinityappslk.com/api/upload_layouts',
               headers: {'x-access-token' : token},
               data:{file: file}
           }).then(function (resp) {

               if(resp.data.error_code == 0){

                   console.log("'Success "+resp.config.data.file.name+' uploaded. Response:');
                   console.log(resp.data);
                   console.log(resp.data.cover_image);
                   vm.requestData.images.push(resp.data.cover_image);
                   console.log(vm.requestData);
                   uploaded_images++
                   if(uploaded_images==files_count){

                     vm.save_layout();
                     uploaded_images = 0;
                   }
               }
           },function(resp){

               console.log("Error status:"+resp.status);
               console.log("Error status:"+resp.status);
           },function (evt) {

               console.log(evt);
               var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
               vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
           });

       };

       vm.save_layout = function(){

         Layout.add_layout(vm.requestData,token).then(function(data){

           vm.message = data.data.message;
           console.log(vm.requestData);
           console.log(data);
           $location.url('/layouts');
         })
         .catch(function (log) {

             console.log(log);
         })
       };

       laysocketio.on('layout',function (data) {

           vm.layout.push(data);
       })
    })

    .controller('EditLayoutCtrl',function($location,$scope, Upload, Customer,Layout,laysocketio,$routeParams){

      var vm = this;
      var token = localStorage.getItem('access_web_token').toString();
      vm.myDate = new Date();
      var uploaded_images = 0;
      var total_selected = 0;
      var para = {};
      para.layout_id = $routeParams.id;
      console.log(para);
      Layout.get_layout(para,token).then(function(data){

        vm.layout_data = data.data;
        vm.layout_data.expire_date = new Date(vm.layout_data.expire_date).toISOString().substring(0, 10);
        console.log(data);
      }).catch(function (fallback) {

          console.log(fallback);
      })
      vm.isOpen = true;
      vm.requestData = {
        customer : "",
        layout : "",
        category : "",
        sub_category : "",
        expire_date : "",
        images : [],
        video_url : ""
      };
      $scope.categoryList = [

          {
              name: "Groom",
              value: "groom",
              subcategory:[
                  {
                      name: "Grooms Attire",
                      value: "grooms_attire"
                  },
                  {
                      name: "Footwear & Accessories",
                      value: "footwear"
                  },
                  {

                      name: "Salons",
                      value: "salons"
                  },
                  {

                      name: "Personal Care",
                      value: "personal_care"
                  }
              ]
          },
          {
              name: "Bride",
              value: "bride",
              subcategory:[
                  {
                      name: "Bridal Designer",
                      value: "bridal_designer"
                  },
                  {
                      name: "Bridal Wear & Fabrics",
                      value: "bridal_wear"
                  },
                  {
                      name: "Jewellery & Accessories",
                      value: "jewellery_accessories"
                  },
                  {
                      name: "Bridal Dressmakers",
                      value: "bridal_dressmakers"
                  },
                  {
                      name: "Bridal Flowers",
                      value: "bridal_flowers"
                  },
                  {
                      name: "Salons",
                      value: "salons"
                  },
                  {
                      name: "Cosmetics & Personal Care",
                      value: "cosmetics"
                  },
                  {
                      name: "Footwear",
                      value: "footwear"
                  }
              ]
          },
          {
              name: "Other",
              value: "other",
              subcategory:[
                  {
                      name: "Photography and Cinematography",
                      value: "photography"
                  },
                  {
                      name: "Hotels",
                      value: "hotels"
                  },
                  {
                      name: "Flowers and Decores",
                      value: "flowers_and_decores"
                  },
                  {
                      name: "Cakes & Invitations",
                      value: "cakes_and_invitations"
                  },
                  {
                      name: "Entertainment",
                      value: "entertainment"
                  },
                  {
                      name: "Poruwa Ceremony",
                      value: "poruwa_ceremony"
                  },
                  {
                      name: "Wedding Cars",
                      value: "wedding_cars"
                  },
                  {
                      name: "Wedding Gifts",
                      value: "wedding_gifts"
                  },
                  {
                      name: "Ashtaka Jayamangala Gatha",
                      value: "ashtaka_jayamangala_gatha"
                  },
                  {
                      name: "Magul Bera",
                      value: "magul_bera"
                  },
                  {
                      name: "Wes Natum",
                      value: "wes_natum"
                  },
                  {
                      name: "Locations",
                      value: "locations"
                  },
                  {
                      name: "Eventmanagements",
                      value: "eventmanagements"
                  },
                  {
                      name: "Travel & Destinations",
                      value: "travel"
                  }
              ]
          }
      ];

      Customer.all_customers(token)
          .then(function (data) {

              $scope.customers = data.data;
              //console.log($scope.customers);
          });
		  
	   vm.deleteImage = function (image) {

          console.log(vm.layout_data.images);
          console.log(image);
          var index = vm.layout_data.images.indexOf(image);
          console.log(index);
          if(index > -1){

              vm.layout_data.images.splice(index, 1);
              vm.layout_data.images.splice(4, 1);
              var img = {};
              img.file_name = image;
              Layout.deleteLayoutImage(img,token);
              console.log("image deleted");
          }
      };

      vm.save_layout_image = function (file, files_count) {

          Upload.upload({

              url: 'http://localhost:3000/api/upload_layouts',
              headers: {'x-access-token': token},
              data: {file: file}
          }).then(function (resp) {

              if (resp.data.error_code == 0) {

                  console.log("'Success " + resp.config.data.file.name + ' uploaded. Response:');
                  console.log(resp.data);
                  console.log(resp.data.cover_image);
                  vm.layout_data.images.push(resp.data.cover_image);
                  console.log(vm.requestData);
                  uploaded_images++
                  if (uploaded_images == files_count) {

                      vm.requestData.images = vm.layout_data.images;
                      vm.save_layout();
                      uploaded_images = 0;
                  }
              }
          }, function (resp) {

              console.log("Error status:" + resp.status);
              console.log("Error status:" + resp.status);
          }, function (evt) {

              console.log(evt);
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
          });

      };

      vm.update_layout = function(){

          vm.requestData.customer = (vm.formData.customer!=null) ? vm.formData.customer : vm.layout_data.customer;
          vm.requestData.layout = (vm.formData.layout_type != null) ? vm.formData.layout_type : vm.layout_data.layout_type;
          vm.requestData.category = (vm.formData.category.value != null) ? vm.formData.category.value : vm.layout_data.category.value;
          vm.requestData.subcategory = (vm.formData.subcategory.value != null) ? vm.formData.subcategory.value : vm.layout_data.subcategory.value;
          vm.requestData.layoutID = vm.layout_data.layoutID;
          if(vm.formData.expire_date!=null)
            var date_con = new Date(vm.formData.expire_date.toISOString());
          else
            var date_con = vm.layout_data.expire_date;
          vm.requestData.expire_date = date_con;
          vm.requestData.video_url = (vm.formData.video != null) ? vm.formData.video : vm.layout_data.video_url;
          var fil = document.getElementById('nbr_images');
          var files_count = fil.files.length;
          for(var i=0;i<files_count;i++){

              vm.save_layout_image(fil.files[i],files_count);
          }
          console.log(vm.formData);
		  vm.save_layout();
          console.log("Uploaded Images:"+uploaded_images);
          console.log("files count:"+files_count);
      }

      vm.save_layout = function(){

          Layout.edit_layout(vm.requestData, token).then(function (data) {

              vm.message = data.data.message;
              console.log(vm.requestData);
              console.log(data);
              $location.url('/layouts');
          }).catch(function (log) {

              console.log(log);
          })
      };

      vm.delete_layout = function(){

        var layout ={};
        layout.layout_id = vm.layout_data.layoutID;
        Layout.delete_layout(layout,token).then(function(data){

            vm.message = data.data.message;
            $location.url('/layouts');
        }).catch(function(log){

            console.log(log);
        });
      }	  

    })

    .controller('AllLayoutCtrl',function($location,$scope,Upload,Layout,laysocketio,DTOptionsBuilder, DTColumnBuilder){

      var vm = this;
      var token = localStorage.getItem('access_web_token').toString();
      Layout.get_layouts(token).then(function(data){

          console.log(data.data);
          var layout_dataload = JSON.stringify(data.data);
          console.log(layout_dataload);
          vm.dtOptions = DTOptionsBuilder.fromSource(JSON.stringify(layout_dataload))
              .withPaginationType('full_numbers');
          vm.dtColumns = [
              DTColumnBuilder.newColumn('layoutID').withTitle('Layout ID'),
              DTColumnBuilder.newColumn('layout_type').withTitle('Layout Type'),
              DTColumnBuilder.newColumn('category').withTitle('Category'),
              DTColumnBuilder.newColumn('subcategory').withTitle('Sub Catgeory')
          ];
          vm.layouts = data.data;
      })
      .catch(function(log){

        console.log(log);
      })

      laysocketio.on('layout',function (data) {

          vm.layout.push(data);
      })
    });
