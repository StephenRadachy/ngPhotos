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

                var photos = db.createObjectStore('photos', {keyPath: 'id', autoIncrement: true});
                photos.createIndex('topicID_idx', 'topicID', {unique: false});
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
    app.controller("indexController",['$scope', '$indexedDB','$http', function($scope, $indexedDB, $http){
        
        $scope.noTopics = true;
        $scope.noServerTopics = true;
        
        $http.get("/myphotos/Topic/getTopics").success(function(response) {
            $scope.serverTopics = response;
            
            if (response.length > 0){
                $scope.noServerTopics = false;
            }
        });
        
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

            // build photo array to insert
            var addToPhotos = [];
            for(var j=0; j < file.length; j++){
                var photo = {"topicID": topicID, "filetype": file[j].filetype, "content": file[j].base64};
                addToPhotos.push(photo);
            }
            
            // create photos in indexedDB
            $indexedDB.openStore('photos',function(store) {
                store.insert(addToPhotos).then(function(e){});
            });

            // redirect to index
            $location.path("/");
        };
    }]);

    // view a topic
    app.controller("viewController",['$scope', '$indexedDB', '$routeParams', '$location', '$http', function($scope, $indexedDB, $routeParams, $location, $http){
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
            
            // build query
            var find = photos.query();
            find = find.$eq($scope.topicID);
            find = find.$index("topicID_idx");
            
            // update scope
            photos.eachWhere(find).then(function(e){
                $scope.photos = e;
            });
        });
        
        
        $scope.deletePhoto = function(id){
            $indexedDB.openStore('photos', function(photos){
                // delete photo
                photos.delete(id);
                
                // build query
                var find = photos.query();
                find = find.$eq($scope.topicID);
                find = find.$index("topicID_idx");
                
                // update scope
                photos.eachWhere(find).then(function(e){
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
        
        
        $scope.submitTopic = function(){
            //make http request for topic submission
            // use this notation <<<<<<<<<< photos1, photos2
            
            /*var submitdata = {};
            console.log("test");
            submitdata['topicName'] = $scope.topicName;*/

            $indexedDB.openStore('photos', function(photos){
                
                // build query
                var find = photos.query();
                find = find.$eq($scope.topicID);
                find = find.$index("topicID_idx");
                
                // update scope
                photos.eachWhere(find).then(function(e){
                    var fd = new FormData();
                    fd.append("topicName", $scope.topicName);
                    
                    fd.append("photos", e.length);
                    console.log("length: " + e.length);
                    
                    for (var j=0; j < e.length; j++){
                        if (typeof e[j] !== 'undefined'){
                            //console.log("photo" + j + "\n\n\n\n\n\n\n\n\n\n\n\n\n");
                            //console.log(window.atob(e[j].content));
                            //fd.append("photo" + j, window.atob(e[j].content));
                            fd.append("photo" + j, e[j].content);
                        }
                    }
                    
                    //console.log(fd); 
                    $.ajax({
                        type: "POST",
                        url: "/myphotos/Topic/submitOfflineTopic",
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done(function(e) {
                        // delete the topic from indexedDB
                        console.log(e);
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
                    });
                });
            });
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

    // add photos to a topic
    app.controller("addPhotosController",['$scope', '$indexedDB', '$routeParams', '$location', function($scope, $indexedDB, $routeParams, $location){
        $scope.topicID = $routeParams.id;
        $scope.submit = function(id){
            
            // get photo(s) data
            // using naif.base64 module 
            // see https://github.com/adonespitogo/angular-base64-upload 
            var file = $scope.myFile;

            // build photo array to insert
            var addToPhotos = [];
            for(var j=0; j < file.length; j++){
                var photo = {"topicID": $scope.topicID, "filetype": file[j].filetype, "content": file[j].base64}
                addToPhotos.push(photo);
            }
            
            // create photos in indexedDB
            $indexedDB.openStore('photos',function(store) {
                store.insert(addToPhotos).then(function(e){});
            });
            
            //redirect back to view
            $location.path("/view/" + $scope.topicID);
        };
    }]);

})();
