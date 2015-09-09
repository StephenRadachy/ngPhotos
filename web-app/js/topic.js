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
            $rootScope.isOnline = false; //online;
        });


    app.config(function($routeProvider, $indexedDBProvider) {

        // indexedDB provider configuration
        $indexedDBProvider
            .connection('myPhotos')
            .upgradeDatabase(1, function(event, db, tx){
                var topics = db.createObjectStore('topics', {keyPath: 'id'});
                topics.createIndex('name_idx', 'name', {unique: false});

                var photos = db.createObjectStore('photos', {keyPath: 'id', autoIncrement: true});
                photos.createIndex('topicID_idx', 'topicID', {unique: false});
                photos.createIndex('filetype_idx', 'filetype', {unique: false});
                photos.createIndex('content_idx', 'content', {unique: false});
            });


        // route configuration - similar to url mapping in Grails

        // list of topics
        $routeProvider.when('/', {
                templateUrl : '../angular-views/topic/index.html',
                controller  : 'indexController'
            })

            // create topic page
            .when('/create',{
                templateUrl : '../angular-views/topic/create.html',
                controller  : 'createController'
            })

            // view photos in a topic
            .when('/view/:id', {
                templateUrl : '../angular-views/topic/view.html',
                controller  : 'viewController'
            })

            // edit a topic
            .when('/edit/:id', {
                templateUrl : '../angular-views/topic/edit.html',
                controller  : 'editController'
            })

            // add a new photo to a topic
            .when('/addPhotos/:id', {
                templateUrl : '../angular-views/topic/addPhotos.html',
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
        $scope.noTopics = true;
        // populate topics from indexedDB
        $indexedDB.openStore('topics', function(e){
            e.getAll().then(function(topics) {  
                // Update scope
                $scope.topics = topics;
                if (topics.length > 0){
                    $scope.noTopics = false;
                }
            });
        });
    }]);

    // create a new topic
    app.controller("createController",['$scope', '$indexedDB', '$location', function($scope, $indexedDB, $location){

        $scope.create = function(){
            
            // get photo(s) data
            // using naif.base64 module 
            // see https://github.com/adonespitogo/angular-base64-upload 
            var file = $scope.myFile;
            
            // see util.js
            var topicID = guid();

            // create topic in indexedDB
            $indexedDB.openStore('topics',function(store) {
                store.insert({"id": topicID, "name": $scope.topicName}).then(function (e) {});
            });

            // create photos in indexedDB
            for(var j=0; j < file.length; j++){
                var ft = file[j].filetype;
                var content = file[j].base64;
                $indexedDB.openStore('photos',function(store) {
                    store.insert({"topicID": topicID, "filetype": ft, "content": content}).then(function (e) {});
                });
            }

            // redirect to index
            $location.path("/");
        };
    }]);

    // view a topic
    app.controller("viewController",['$scope', '$indexedDB', '$routeParams', '$location', function($scope, $indexedDB, $routeParams, $location){
        $scope.topicID = $routeParams.id;
        
        // set topic name
        $indexedDB.openStore('topics', function(e){
            e.find($scope.topicID).then(function(topic) {  
                // Update name
                $scope.topicName = topic.name;
            });
        });
        
        // set photos
        $indexedDB.openStore('photos', function(photos){
            photos.getAll().then(function(e){

                // find photos which are apart of the topic
                var ret = [];
                for (var j = 0; j < e.length; j++){
                    if (e[j].topicID == $scope.topicID){
                        ret.push(e[j]);
                    }
                }

                // set in scope
                $scope.photos = ret;
            });
        });
        
        
        $scope.deletePhoto = function(id){
            $indexedDB.openStore('photos', function(photos){
                // delete photo
                photos.delete(id);
                
                // update scope
                photos.getAll().then(function(e){
                    $scope.photos = e;
                });
            });
        };

        $scope.deleteTopic = function(){
            // delete all photos from the topic
            $indexedDB.openStore('photos', function(photos){
                photos.getAll().then(function(e){
                    for (var j = 0; j < e.length; j++){
                        if (e[j].topicID == $scope.topicID){
                            photos.delete(e[j].id);
                        }
                    }
                });
            });
            
            // delete the topic itself from indexedDB
            $indexedDB.openStore('topics', function(topics){
                topics.delete($scope.topicID);
            });
            // redirect to index
            $location.path("/");
        };
    }]);

    // edit the name of the topic
    app.controller("editController",['$scope', '$indexedDB','$routeParams', '$location', function($scope, $indexedDB, $routeParams, $location){
        $scope.topicID = $routeParams.id;

        $scope.edit = function(){
            //update topic name in indexedDB
            $indexedDB.openStore('topics',function(store) {
                store.upsert({"id": $scope.topicID, "name": $scope.topicName}).then(function (e) {});
            });
        
            //redirect back to view
            $location.path("/view/" + $scope.topicID);
        };
        
        
    }]);

    // add a new photo to a topic
    app.controller("addPhotosController",['$scope', '$indexedDB', '$routeParams', '$location', function($scope, $indexedDB, $routeParams, $location){
        $scope.topicID = $routeParams.id;
        $scope.submit = function(id){
            
            // get photo(s) data
            // using naif.base64 module 
            // see https://github.com/adonespitogo/angular-base64-upload 
            var file = $scope.myFile;
            
            // create photos in indexedDB
            for(var j=0; j < file.length; j++){
                var ft = file[j].filetype;
                var content = file[j].base64;
                $indexedDB.openStore('photos',function(store) {
                    store.insert({"topicID": $scope.topicID, "filetype": ft, "content": content}).then(function (e) {});
                });
            }
            //redirect back to view
            $location.path("/view/" + $scope.topicID);
        };
    }]);

})();
