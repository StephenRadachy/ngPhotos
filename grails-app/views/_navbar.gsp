<nav class = "navbar navbar-default">
    <div class = "container-fluid">
        <div class = "navbar-header">
            <button type = "button" class = "navbar-toggle collapsed" data-toggle = "collapse" data-target = "#navbar" aria-expanded = "false" aria-controls = "navbar">
                <span class = "sr-only">Toggle navigation</span>
                <span class = "icon-bar"></span>
                <span class = "icon-bar"></span>
                <span class = "icon-bar"></span>
            </button>
            <a class = "navbar-brand" href = "/myphotos">myPhotos</a>
        </div>

        <div id = "navbar" class = "collapse navbar-collapse">
            <ul class = "nav navbar-nav grails">                    
                <!-- Links go here for the pages -->
                <li><a href = "/myphotos/topic/create">Create a Topic</a></li>
                <li><a href = "/myphotos/topic">View Topics</a></li>
            </ul>
            <ul class = "nav navbar-nav angular">                    
                <!-- Links go here for the pages -->
                <li><a href = "/myphotos/topic/#/create">Create a Topic</a></li>
                <li><a href = "/myphotos/topic/#">View Topics</a></li>
            </ul>
        </div> <!-- collapse -->
    </div> <!-- container-fluid -->
</nav>