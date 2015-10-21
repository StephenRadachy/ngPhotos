<!DOCTYPE html>
<html>
    <head>
        <title><g:layoutTitle/></title>

        <g:external dir="js" file="vendor/jquery.js"/>
        <g:external dir="js" file="vendor/bootstrap.js"/>
        
        <g:external dir="css" file="vendor/bootstrap.css"/>
        <g:external dir="css" file="style.css"/>
        <g:layoutHead/>
    </head>
    <body>
        <g:render template="/navbar" />
        <g:layoutBody/>
        <br /><br /> <!-- Add some whitespace at the bottom -->
        <script>
        // hides angular menu items
        $( document ).ready(function() {
            $(".angular").hide();
        });
        </script>
    </body>
</html>
