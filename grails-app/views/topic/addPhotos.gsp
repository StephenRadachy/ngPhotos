<!DOCTYPE html>
<html>
    <head>
        <title>ngPhotos - Upload pictures to ${topic.name}</title>
        <meta name = "layout" content = "main">
    </head>
    <body>
        <div class = "container-fluid">
            <div class = "row">
                <div class = "col-xs-6 col-xs-offset-3">
                    <g:uploadForm controller="topic" action="submitPhotos">
                        <div class = "form-group">
                            <label for = "photos">Photos</label>
                            <input type = "file" name = "photos" accept = "image/*" capture multiple>
                            <input type = "hidden" name = "id" value = "${topic.id}">
                        </div>
                        <button type = "submit" class = "btn btn-default">Submit</button>
                    </g:uploadForm>
                </div>
            </div>
        </div>
    </body>
</html>