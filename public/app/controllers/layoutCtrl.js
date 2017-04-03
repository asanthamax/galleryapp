/**
 * Created by asantha on 4/1/2017.
 */
angular.module('layoutCtrl',[])

    .controller('LayoutController',function ($location,$scope, Upload, Customer) {

        var vm = this;
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

        Customer.all_customers()
            .then(function (data) {

                $scope.customers = data.data;
            })

    })
