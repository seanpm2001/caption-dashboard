define(function(require) {
    "use strict"

    var youtube = require("./apis/youtube")
    var github = require("./apis/github")
    var languages = {}
    $.getJSON("https://raw.githubusercontent.com/JumpLink/country-list/master/all_languages.json", function(res) {
        languages = res.en_GB
    })

    console.log(youtube)
    console.log(github)

    $(document).ready(function() {
        $("#videos-list").click(function(e) {
            var classes = e.target.classList
            var isEditButton
            var videoId

            classes.forEach(function(item) {
                if (item.indexOf("edit-video-") !== -1) {
                    isEditButton = true
                    videoId = item.replace("edit-video-", "")
                }
            })

            if (isEditButton) {
                editVideo(videoId)
            }
        })

        $("#return-button").click(function() {
            $("#videos-container").removeClass("hidden")
            $("#edit-video-container").addClass("hidden")
        })
    })

    function editVideo(videoId) {
        $("#videos-container").addClass("hidden")
        $("#edit-video-container").removeClass("hidden")

        var video = youtube.getVideoById(videoId)

        $("#video-title").text(video.snippet.title)
        $("#video-thumbnail").attr("src", video.snippet.thumbnails.medium.url)

        $("#captions-list").empty()

        youtube.getCaptionsFromVideo(videoId, function(captions) {
            captions.forEach(function(caption) {
                caption.snippet.language = caption.snippet.language.replace("-", "_")
                var language = languages[caption.snippet.language]
                language = (language) ? language : "Unknown"
                var type = (caption.snippet.trackKind === "ASR") ? "Automatically generated" : ""
                $("#captions-list").append(
                    '<div class="mdl-list__item video-item">' +
                        '<span class="mdl-list__item-primary-content">' +
                            language + ((type) ? (" - " + type) : "") + ((caption.snippet.isDraft) ? " - draft" : "") +
                        '</span>' +
                    '</div>'
                )
            })
        })
    }

    gapi.load('client')
})
