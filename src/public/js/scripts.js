$(document).ready(function(){
    $('#description').on('click', function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('body').css('height', 'min-content');
            $('#project-description').animate({
                height: '100%',
                padding: "2rem 1rem"
            }, 200, function() {
                $(this).animate({
                    opacity: 1,
                },100);
            });
        } else {
            $('body').css('height', window.innerWidth < 768 ? 'min-content' : '100%');
            $('#project-description').animate({
                opacity: 0,
            }, 200, function(){
                $(this).animate({
                    padding: 0,
                    height: 0
                }, 200);
            });
        }
    });
});