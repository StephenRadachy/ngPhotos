<!DOCTYPE html>
<html>
    <head>
        <title>ngPhotos - Create a Topic</title>
        <meta name = "layout" content = "main">
    </head>
    <body>
        <div class = "container-fluid">
            <div class = "row">
                <div class = "col-xs-6 col-xs-offset-3">
                    <g:uploadForm controller="topic" action="submitTopic">
                        <div class = "form-group">
                            <label for = "topicName">Topic Name</label>
                            <g:textField name = "topicName" type = "text" class = "form-control" id = "topicName"></g:textField>
                        </div>
                        <div class = "form-group">
                            <label for = "photos">Photos</label>
                            <input type = "file" name = "photos" multiple>
                            <p class = "help-block">Uploading photos is optional</p>
                        </div>
                        <button type = "submit" class = "btn btn-default">Create</button>
                    </g:uploadForm>
                </div>
            </div> <!-- row -->
        </div> <!-- Container -->
    </body>
</html>