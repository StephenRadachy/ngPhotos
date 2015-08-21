<!DOCTYPE html>
<html>
    <head>
        <title>myPhotos - Topics</title>
        <meta name = "layout" content = "main">
        <g:external dir="js" file="topic.js"/>
    </head>
    <body>
        <div ng-app="topic" class = "container-fluid grails">
            <div class = "col-sm-10 col-sm-offset-1">
                <h1 id = "serverTopicsHeading">Topics Stored on Server</h1>
                <mp:topicCollection />
            </div>
            <div ng-view></div>
        </div> <!-- Container -->
    </body>
</html>
