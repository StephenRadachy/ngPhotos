Updated: 10/4/15 - Stephen Radachy


ngPhotos Developer’s Guide
Overview
The goal of the ngPhotos project is to demonstrate the addition of offline functionality given an online Grails app. It is not intended as an example of a "complete" app. This is a modification of the myPhotos web app. myPhotos which was written by Adam Weidner during the Spring 2015 semester. Adam's project files (with some code corrections by me) are located here: 


        https://bitbucket.org/grailsdirectedstudy/myphotos-online-only 


In writing this documentation, I assume you have basic knowledge of Grails, Javascript, HTML, and CSS. Since the focus of this project is the offline portion using Angular.JS, I will not be covering the Grails online side. You can find more information about it here:
https://docs.google.com/document/d/1HxfMzYZ-XIb3eaKZMQRsF_mtGNixXEpm9xViA7nKmvs/edit?usp=sharing 


Primary Developer
* Stephen Radachy <sjradach@mtu.edu>


Major Frameworks / Libraries
* Grails 2.5.0
* Angular.JS 1.4.4
* Angular Route 1.4.4 
* jQuery 2.1.3
* Bootstrap 3.3.2
* CSS3


Additional Resources
* Angular Indexed DB 1.1.1 https://github.com/bramski/angular-indexedDB 
* Angular Base64 Upload 0.1.12 https://github.com/adonespitogo/angular-base64-upload


Architecture﻿
The offline portion of ngPhotos was designed as a single page application with multiple routes aka views which is intended to mimic the the controllers / view architecture in a standard Grails project.


It’s important to note that Angular has access to globals (and it is possible) to write inline plain Javascript and jQuery. Also, this application (and Angular.JS in general) relies heavily on 


There are four major portions to the ngPhotos application (nearly all Angular code is within and relative to the web-app folder)
* “Model” / IndexedDB
   * Pulled off using Angular-IndexedDB + Base64 Upload module
   * Code located in web-app/js/topic.js within each controller to make basic calls to insert, delete, etc.
   * See https://github.com/bramski/angular-indexedDB and https://github.com/adonespitogo/angular-base64-upload for documentation
   * Note indexes are only required for fields you want to be searchable
   * See web-app/js/util.js for information about guid generation
   * Each topic has a TopicID which is referenced in each photo that belongs to a specific topic. This is a top-down approach.
   * Photos are stored as Base64 strings
* Views / routes
   * Route configuration is located in web-app/js/topic.js
      * each route specifies an angular html template and controller to reference.
      * One route per required view
   * Angular templates are located in angular-views/topic
      * One template per required view
* Controllers
   * Code located in web-app/js/topic.js
   * Note that any angular providers you want to reference within the controller must be injected into the controller definition
* Additional  required non-Angular pieces
   * JS includes
      * see grails-app/views/layouts/topic.gsp
      * This layout is only for topic controller grails views
   * Angular app + view definition
      * see grails-app/views/topic/index.gsp
   * Online/Offline toggles
      * Menu items
         * see grails-app/views/layouts/topic.gsp
            * Note this is done using jQuery since this is outside of Angular’s scope
      * List of stored topics (server / locally)
         * see web-app/angular-views/topic/index.html
            * Note this is done using Angular
         * Also see web-app/js/topic.js indexController for the referenced variables
   * HTML5 Offline Manifest
      * see grails-app/controllers/ngphotos/ManifestController.groovy
      * see grails-app/views/manifest/index.gsp
      * see grails-app/views/layouts/topic.gsp
      * see web-app/js/offline.js and online.js
   * Displaying Grails topics
      * Since it is not possible to have a dynamic Grails view and Angular play nice together, you have to display it using Angular. This is done by rendering JSON from a Grails action
         * see grails-app/controllers/ngphotos/TopicController.groovy (def getTopics)
         * see web-app/angular-views/topic/index.html
         * see web-app/js/topic.js (indexController)
   * Submitting a topic (Offline->Online)
      * this is done by submitting information to a custom action which create the topic and photos
      * see web-app/js/topics.js (viewController - $scope.submitTopic)
      * see grails-app/controllers/ngphotos/TopicsController.groovy (def SubmitOfflineTopic)
         * Makes the topic
         * makes the photos by decoding the Base64 into a byte array
