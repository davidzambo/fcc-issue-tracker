$(document).ready(function(){
    $('#description').on('mouseover', function(){
        $('#content').animate({
            'margin-top': 0
        }, 200, function(){
            $('#project-description').animate({
                opacity: 1
            }, 200);
        });
    });
});