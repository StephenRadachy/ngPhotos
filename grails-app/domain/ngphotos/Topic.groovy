package ngphotos 

import ngphotos.Photo

class Topic {
    static hasMany = [photos: Photo]
    String name
}
