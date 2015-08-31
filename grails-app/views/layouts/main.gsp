<!DOCTYPE html>
<html manifest="${request.contextPath}/manifest">
    <head>
        <title><g:layoutTitle/></title>

        <g:external dir="js" file="vendor/jquery.js"/>
        <g:external dir="js" file="vendor/angular.js"/>
        <g:external dir="js" file="vendor/angular-route.js"/>
        <g:external dir="js" file="vendor/angular-indexed-db.js"/>
        <g:external dir="js" file="vendor/angular-base64.js"/>
        <g:external dir="js" file="vendor/bootstrap.js"/>
        <g:external dir="js" file="util.js"/>
        <!-- Helps determine online status -->
        <g:external dir="js" file="online.js" />

        <g:external dir="css" file="vendor/bootstrap.css"/>
        <g:external dir="css" file="style.css"/>
        <g:layoutHead/>
    </head>
    <body>
        <g:render template="/navbar" />
        <g:layoutBody/>
        <br /><br /> <!-- Add some whitespace at the bottom -->
        <script>
        // toggles grails elements depending on the online status
        $( document ).ready(function() {
            if (online){
                $(".grails").show();
                $(".angular").hide();
            } else {
                $(".grails").hide();
                $(".angular").show();
            }
        });
        </script>
    </body>
</html>
