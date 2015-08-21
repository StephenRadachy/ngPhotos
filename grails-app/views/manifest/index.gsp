CACHE MANIFEST
# author: Stephen J. Radachy

# force reload the manifest EVERYTIME
#

CACHE:
# save these files locally for offline use
${request.contextPath}/js/vendor/angular.js
${request.contextPath}/js/vendor/angular-route.js
${request.contextPath}/js/vendor/angular-base64.js
${request.contextPath}/js/vendor/bootstrap.js
${request.contextPath}/js/vendor/jquery.js
${request.contextPath}/js/topic.js
${request.contextPath}/js/util.js

FALLBACK:
# 'content-online' falls back to 'content-offline'
${request.contextPath} ${request.contextPath}/
${request.contextPath}/js/online.js ${request.contextPath}/js/offline.js
${request.contextPath}/topic/create ${request.contextPath}/topic#/create
${request.contextPath}/topic/addPhotos ${request.contextPath}/topic#/addPhotos
${request.contextPath}/topic/edit ${request.contextPath}/topic#/edit
${request.contextPath}/topic/view ${request.contextPath}/topic#/view
${request.contextPath}/topic/index ${request.contextPath}/topic#/

NETWORK:
*