<!DOCTYPE html>
<html>
    <head>
        <title>myPhotos - Editing ${topic.name}</title>
        <meta name = "layout" content = "main">
    </head>
    <body>
        <div class = "container-fluid">
            <div class = "row">
                <div class = "col-xs-6 col-xs-offset-3">
                    <g:form controller="topic" action="confirmEdit">
                        <div class = "form-group">
                            <label for = "topicName">Topic Name</label>
                            <g:textField name = "topicName" type = "text" class = "form-control" id = "topicName" value = "${topic.name}"></g:textField>
                            <input type = "hidden" name = "id" value = "${topic.id}">
                        </div>
                        <button type = "submit" class = "btn btn-default">Confirm</button>
                    </g:form>
                </div>
            </div>
        </div>
    </body>
</html>
