<!DOCTYPE html>
<html>
    <head>
        <title>myPhotos - Topics</title>
        <meta name = "layout" content = "topic">
        <g:external dir="js" file="topic.js"/>
	<script>
		contextPath = "${request.contextPath}";
	</script>
    </head>
    <body>
        <div ng-app="topic" class = "container-fluid">
            <div ng-view></div>
        </div> <!-- Container -->
    </body>
</html>
