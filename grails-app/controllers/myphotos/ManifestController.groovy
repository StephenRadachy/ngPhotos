package myphotos

class ManifestController {
    def index = {
        response.setContentType 'text/cache-manifest'
    }
}
