package ngphotos
import grails.converters.JSON
class TopicController {
    
    def index() {

        render(view: "index")
    }


    def view() {

        def topic = Topic.get(params.id)
        def model = [topic: topic, photos: topic.photos]
        render(view: "view", model: model)
    }
    
    def getTopics() {
        render Topic.list() as JSON
    }

    def addPhotos() {

        def topic = Topic.get(params.id)
        def model = [topic: topic]

        render(view: "addPhotos", model: model)
    }

    // This is the endpoint to process forms from the addPhotos.gsp
    // view.  This method selects an already existing topic and
    // adds some new photos to it
    def submitPhotos() {

        def topic = Topic.get(params.id)

        List fileList = request.getFiles("photos")
        fileList.each { file ->
            def photo = new Photo(data: file.getBytes())
            topic.addToPhotos(photo)
        }
        topic.save(flush: true)

        return redirect(controller: "topic", action: "view", params: [id: topic.id])
    }

    def edit() {

        def topic = Topic.get(params.id)
        def model = [topic: topic]

        render(view: "edit", model: model)
    }

    def confirmEdit() {

        def topic = Topic.get(params.id)
        topic.name = params.topicName
        topic.save(flush: true)
        return redirect(controller: "topic", action: "view", params: [id: topic.id])
    }

    def delete() {

        Topic.get(params.id).delete(flush: true)
        return redirect(view: "index")
    }

    def create() {

        render(view: "create")
    }

    // This is the endpoint to process forms from the create.gsp view.
    // This method creates an entirely new topic with some optional photos.
    def submitTopic() {

        def topic = new Topic(name: params.topicName)

        List fileList = request.getFiles("photos")
        print(fileList.size())
        fileList.each { file ->
            if (!file.isEmpty()) {
                def photo = new Photo(data: file.getBytes())
                topic.addToPhotos(photo)
            }
        }
        topic.save(flush: true)

        return redirect(controller: "topic", action: "view", params: [id: topic.id])
    }
    
    // This method is the endpoint to process forms from the
    // submitTopic action for offline topics.  This method
    // is similar to createTopic in the online topic controller
    // (TopicController.groovy) in that the same action is
    // performed.  The topic and photo data is sent to this action
    // in a slightly different way, however, so both methods must exist.
    def submitOfflineTopic() {
        def topic = new Topic(name: params.topicName)

        for (int i = 0; i < params.photos.toInteger(); i++) {
            if (params["photo" + i] != null){
                def dat = new Photo(data: params["photo" + i].decodeBase64())
                topic.addToPhotos(dat)
            }
        }
        topic.save(flush: true)
    
        def response = [
            'result': 'success',
        ]

        render response as JSON
    }

}
