package myphotos 

import myphotos.Photo

class Topic {
    static hasMany = [photos: Photo]
    String name
}
