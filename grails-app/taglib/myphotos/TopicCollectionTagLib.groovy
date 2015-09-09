package myphotos

import myphotos.Topic
import myphotos.Photo

class TopicCollectionTagLib {
    static namespace = "mp"

    def topicCollection = { attrs ->
        out << createCollection()
    }

    def createCollection() {
        StringBuilder sb = new StringBuilder()

        def topicList = Topic.list() 

        if (topicList.size() > 0) {
            def rows = Topic.list().collate(4)

            for (row in rows) {
                sb << """
                    <div class = "row">
                """
                
                for (topic in row) {
                    def caption = topic.name
                    def topicId = topic.id

                    def photoSrc = ""
                    if (topic.photos.asBoolean())
                        photoSrc = "/myphotos/photo/view/" + topic.photos.first().id
                    else
                        photoSrc = "http://placehold.it/350x350"

                    def imageTemplate = """
                        <div class = "col-md-3 col-xs-12">
                            <h3><a href = "/myphotos/topic/view/${topicId}">${caption}</a></h3>
                            <div style = "height: 20%; overflow: hidden">
                                <div class = "thumbnail">
                                    <img src = "${photoSrc}" />
                                </div>
                            </div>
                        </div> 
                    """
                    sb << imageTemplate
                }

                sb << """
                    </div>
                """
            }
        } else {
            sb << """
                <div class = "jumbotron">
                    <h1>Nothing here yet!</h1>
                    <p><a href = "/myphotos/topic/create">Create a Topic</a> to get started!</p>
                </div>
            """
        }

        sb.toString()
    }
}
