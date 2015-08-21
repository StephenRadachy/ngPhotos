package myphotos 

import myphotos.Topic

class Photo {
    static belongsTo = [topic: Topic]
    byte[] data

    static constraints = {
        // Max size is 50 mb per photo
        data maxSize: 50 * 1024 * 1024
    }
}
