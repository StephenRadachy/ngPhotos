package myphotos

class PhotoController {

    def index() {
    }

    def view() {
        def id = params.id
        def photo = Photo.read(id)

        render(contentType: "application/octet-stream", file: photo.data)
    }

    def delete() {
        def photo = Photo.get(params.id)
        def topic = photo.topic

        photo.delete(flush: true)

        return redirect(controller: "topic", action: "view", params: [id: topic.id])
    }
}
