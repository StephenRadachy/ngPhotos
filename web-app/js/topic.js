// author: Stephen J. Radachy
(function() {

    var app = angular.module('topic',['ngRoute','indexedDB','naif.base64'])
        .run(function($rootScope){
            // grabs online status from JS online variable.
            // defined in web-app/js/online.js and
            // web-app/js/offline.js
            // see /grails-app/angular-views/topic/manifest/index.gsp

            // $rootScope is how global variables are defined in Angular.JS
            // see: https://docs.angularjs.org/api/ng/type/$rootScope.Scope

            //used for hiding angular dom elements while online
            $rootScope.isOnline = false;//online;
        });


    app.config(function($routeProvider, $indexedDBProvider) {

        // indexedDB provider configuration
        $indexedDBProvider
            .connection('myPhotos')
            .upgradeDatabase(1, function(event, db, tx){
                var topics = db.createObjectStore('topics', {keyPath: 'id'});
                topics.createIndex('name_idx', 'name', {unique: false});

                var photos = db.createObjectStore('photos', {keyPath: 'id'});
                photos.createIndex('content_idx', 'content', {unique: false});
                photos.createIndex('topicID_idx', 'topicID', {unique: false});
            });


        // route configuration - similar to url mapping in Grails

        // list of topics
        $routeProvider.when('/', {
                templateUrl : 'angular-views/topic/index.html',
                controller  : 'indexController'
            })

            // create topic page
            .when('/create',{
                templateUrl : 'angular-views/topic/create.html',
                controller  : 'createController'
            })

            // view photos in a topic
            .when('/view/:id', {
                templateUrl : 'angular-views/topic/view.html',
                controller  : 'viewController'
            })

            // edit a topic
            .when('/edit/:id', {
                templateUrl : 'angular-views/topic/edit.html',
                controller  : 'editController'
            })

            // add a new photo to a topic
            .when('/addPhotos/:id', {
                templateUrl : 'angular-views/topic/addPhotos.html',
                controller  : 'addPhotosController'
            })

            // otherwise go to list of topics
            .otherwise({ redirectTo: '/'});


    });

    // define our controllers; note the referenced dependencies
    // see: https://docs.angularjs.org/api/ng/service/$controller
    // $scope references this specific controller

    // list of topics
    app.controller("indexController",['$scope', '$indexedDB', function($scope, $indexedDB){
        // populate topics from indexedDB
    }]);

    // create a new topic
    app.controller("createController",['$scope', '$indexedDB', function($scope, $indexedDB){

        $scope.create = function(){
            var file = $scope.myFile;
            console.dir(file);
            var topicID = guid();

            // create topic in indexedDB
            // $scope.topicName


            // create photo in indexedDB
            $indexedDB.openStore('photos',function(store) {

                store.insert({"id": guid(), "content": file.base64, "topicID": guid()}).then(function (e) {
                });
            });

            // redirect to index
            //$location.path("/");
        };
    }]);

    // view a topic
    app.controller("viewController",['$scope', '$indexedDB', '$routeParams', function($scope, $indexedDB, $routeParams){
        $scope.topicID = $routeParams.id;

        $scope.deletePhoto = function(id){
            //delete photo from indexedDB
            //update page
        };

        $scope.deleteTopic = function(){
            // delete all photos from the topic
            // delete the topic itself from indexedDB
            // redirect to index
            //$location.path("/");
        };
    }]);

    // edit the name of the topic
    app.controller("editController",['$scope', '$indexedDB','$routeParams',function($scope, $indexedDB, $routeParams){
        $scope.topicID = $routeParams.id;

        //update topic name in indexedDB
        //redirect back to view

        //$location.path("/view/" + $scope.topicID);
    }]);

    // add a new photo to a topic
    app.controller("addPhotosController",['$scope', '$indexedDB', '$routeParams', function($scope, $indexedDB, $routeParams){
        $scope.topicID = $routeParams.id;
        $scope.submit = function(id){
            var file = $scope.myFile;
            console.dir(file);

            $indexedDB.openStore('photos',function(store) {

                store.insert({"id": guid(), "content": file.base64, "topicID": guid()}).then(function (e) {
                });
            });
            //redirect back to view
            //$location.path("/view/" + $scope.topicID);
        };
    }]);

    // handle file upload
    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

})();
