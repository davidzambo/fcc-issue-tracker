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
    const self = this;
    $('form').on('submit', function(e){
        $('#response').empty();
        const method = $(this).attr('method');
        if (method === 'GET') {
            return true;
        }
        const formData = {};

        e.preventDefault();

        $(this)
            .find('input, select, textarea')
            .map(function(){
                if (this.value) {
                    formData[this.name] = this.value;
                }
        });

        $.ajax({
            url: $(this).attr('action'),
            type: method,
            data: formData,
            cache: false,
            processData: true,
            success: function(response){
                $('#response').text(JSON.stringify(response, null, 4));
                $('#result').show();
                $('html, body').animate({
                    scrollTop: $('#result').offset().top
                },200);
            },
            error: function(response) {
                alert(JSON.stringify(response));
            }
        });
    });
};

$(document).ready(function(){
    window.issueTracker = new IssueTracker();



});