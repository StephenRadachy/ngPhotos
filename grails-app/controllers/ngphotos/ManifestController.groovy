package ngphotos

class ManifestController {
    def index = {
        response.setContentType 'text/cache-manifest'
    }
}
