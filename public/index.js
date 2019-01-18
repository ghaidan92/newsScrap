$(document).ready(function () {
    function getAllData() {
        $.getJSON("/all", function (data) {
            console.log(data);
            
            $(".table tbody").empty();
            for(var i = 0; i < data.length; i++) {
                $(".table tbody").append(`<tr><td>${data[i].title}</td><td class="link-text"><a href="${data[i].link}">Link to article</a></td><td class="save-link"><a href="${data[i].favorite}">Save article</a></td>tr>`);
            }
        });
    }
    function deleteAllData() {
        $.getJSON("/delete", function (data) {
            console.log(data);
            
            $(".table tbody").empty();
        });
    }

    $("#scrape-data").on("click", function(e){
        e.preventDefault();
        console.log("worked")
        $.getJSON("/scrape", function(data){
            console.log(data)
            if(data) {
                getAllData();
            }
        })
    });

    $("#delete-data").on("click", function(e){
        e.preventDefault();
        console.log("worked")
        window.location.replace("/")
    });
    $(".save-link").on("click", function(e){
        e.preventDefault();
        console.log("saved link")
        $.postJSON("/saved", function(data){
            console.log(data)
            if(data) {
                getAllData();
            }
        })
    });
});