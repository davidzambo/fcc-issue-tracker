function IssueTracker(){
    const self = this;
    self.handleDescription();
    self.handleForm();
}

IssueTracker.prototype.handleDescription = function(){
    $('#description').on('click', function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('#project-description').animate({
                height: '100%',
                padding: "2rem 1rem"
            }, 200, function() {
                $(this).animate({
                    opacity: 1,
                },100);
            });
        } else {
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
};

IssueTracker.prototype.handleForm = function () {
    $('form').on('submit', function(e){
        e.preventDefault();
        $('#response').empty();
        const formData = {};
        const method = $(this).attr('method');
        $('form[method= ' + post + ']')
            .find('input, select, textarea')
            .map(function(){
                formData[this.name] =  this.value;
        });

        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            data: formData,
            cache: false,
            processData: true,
            contentType: false,
            success: function(response){
                $('#response').text(JSON.stringify(response));
                // response.error.map(el => {
                //     $('#response').append($('<p>').text(el));
                // });
                $('#result').show();
            },
            error: function(response) {
                console.log(response);
            }
        });
    });
};

$(document).ready(function(){
    window.issueTracker = new IssueTracker();



});