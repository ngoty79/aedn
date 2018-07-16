$( document ).ready(function() {
    (function ($) {
        if (typeof($.fn.bxSlider) == "function") {
            var bannerBox = $('div.pt-widget-banner-container-basic'),
                autoPlay = bannerBox.attr('data-autoPlay'),
                sliderCount = bannerBox.attr('sliderCount'),
                exposureTime = parseInt(bannerBox.attr('data-exposureTime')) * 1000;
            if (isNaN(exposureTime)) {
                exposureTime = 3000;
            }
            var $bxSlider = $('.bxslider-basic'),
                $bxControls,
                option = {
                    auto: true,
                    pause: exposureTime,
                    autoStart: autoPlay == "true",
                    autoControls: autoPlay == "true" && sliderCount > 1 ? true : false,
                    controls: true,
                    speed: 400,
                    minSlides: 1,
                    maxSlides: 1,
                    //slideWidth: config.width,
                    slideMargin: 0,
                    moveSlides: 1,
                    onSliderLoad: function () {
                        $bxControls = $bxSlider.parents('.bx-wrapper').find('.bx-controls');
                        $bxControls.find('.bx-start').attr({title: '재생', tabindex: '0'});
                        $bxControls.find('.bx-start').attr({alt: '재생', tabindex: '0'});
                        $bxControls.find('.bx-stop').attr({title: '일시정지', tabindex: '0'});
                        $bxControls.find('.bx-stop').attr({alt: '일시정지', tabindex: '0'});

                        $("li[data-url$='.swf']").each(function (idx, flashDiv) {
                            flashDiv = $(flashDiv);
                            flashDiv.find('div').attr('id', 'flashDiv_' + idx);
                            var flashvars = {},
                                params = {wmode: "transparent"},
                                attributes = {};
                            swfobject.embedSWF(flashDiv.attr('data-url'), 'flashDiv_' + idx, flashDiv.css('width'), flashDiv.css('height'), "9.0.0", "/common/js/swfobject/expressInstall.swf", flashvars, params, attributes);
                        });
                    }
                };
            $bxSlider.bxSlider(option);
        }
    }(jQuery));

});