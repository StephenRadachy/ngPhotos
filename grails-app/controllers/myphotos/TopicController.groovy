package myphotos

class TopicController {
    
    def index() {

        render(view: "index")
    }


    def view() {

        def topic = Topic.get(params.id)
        def model = [topic: topic, photos: topic.photos]

        render(view: "view", model: model)
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
        return redirect(uri: "/")
    }

    def create() {

        render(view: "create")
    }

    // This is the endpoint to process forms from the create.gsp view.
    // This method creates an entirely new topic with some optional photos.
    def submitTopic() {

        def topic = new Topic(name: params.topicName)

        List fileList = request.getFiles("photos")
        fileList.each { file ->
            if (!file.isEmpty()) {
                def photo = new Photo(data: file.getBytes())
                topic.addToPhotos(photo)
            }
        }
        topic.save(flush: true)

        return redirect(controller: "topic", action: "view", params: [id: topic.id])
    }
}
