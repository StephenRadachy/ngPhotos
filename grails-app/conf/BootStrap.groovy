import groovy.io.FileType

import myphotos.Topic
import myphotos.Photo

class BootStrap {

    def init = { servletContext ->
        def folder = System.getProperty("user.home") + "/albums"
        def dir = new File(folder)

        if (dir.exists()) {
            dir.eachFileRecurse(FileType.FILES) { file ->
                if (file.toString().endsWith(".jpg")) {
                    def topicName = file.toString().split("/")[-2]
                    def fileName = file.toString().split("/")[-1]
                    
                    def bytes = file.getBytes()
                    
                    def topics = Topic.where {
                        name == topicName
                    }.list()

                    if (topics.size() > 0) {
                        // Append the photo to the first topic
                        def photo = new Photo(data: bytes)
                        topics[0].addToPhotos(photo)
                        topics[0].save()
                    } else {
                        def topic = new Topic(name: topicName)
                        topic.save()

                        def photo = new Photo(data: bytes)
                        topic.addToPhotos(photo)
                        topic.save()
                    }
                }
            }
        }
    }
    def destroy = {
    }
}
