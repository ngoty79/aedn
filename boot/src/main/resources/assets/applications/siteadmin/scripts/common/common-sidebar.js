(function($) {
    var CommonSidebarController = function(selector) {
        this.init(selector);
    };

    $.extend(CommonSidebarController.prototype, {
        $container: null,

        init: function(selector) {
            var me = this;

            me.$container = $(selector);

            //me.changePageTitle();
            me.activateCurrentMenu();
            me.hideOnSmallScreen();
        },

        activateCurrentMenu: function() {
            var me = this,
                currentPath = window.location.pathname;

            var currentPathPrefix = currentPath;
            if(currentPath.indexOf("?") > 0){
                currentPathPrefix = currentPath.substring(0, currentPath.lastIndexOf('?')+1);
            }
            var currentSidebarMenu = me.$container.find('a[href^="' + currentPathPrefix + '"]');

            if (currentPath !== '/index') {
                currentSidebarMenu.closest('.commonSidebar-first-depth-menu').addClass('start active open');
                currentSidebarMenu.closest('.commonSidebar-first-depth-menu').find('a')
                    .append($('<span class="selected"></span>'));
                currentSidebarMenu.closest('.commonSidebar-first-depth-menu').find('.arrow').addClass('open');
                if (currentSidebarMenu.hasClass('commonSidebar-second-depth-menu-item')) {
                    currentSidebarMenu.closest('.commonSidebar-second-depth-menu').addClass('active open');
                }
            }
        },

        changePageTitle: function() {
            var me = this,
                currentPath = window.location.pathname,
                currentPathPrefix = currentPath.substring(0, currentPath.lastIndexOf('/'));

            var currentSidebarMenu = me.$container.find('a[href^="' + currentPathPrefix + '"]');

            if (currentSidebarMenu.length > 0 && document.title == 'NFMA') {
                document.title = currentSidebarMenu.text() + ' | NFMA';
            } else if (document.title != 'NFMA') {
                document.title = document.title + ' | NFMA';
            }
        },

        hideOnSmallScreen: function() {
            if ($(window).width() <= 1024) {
                var body = $('body');
                var sidebar = $('.page-sidebar');
                var sidebarMenu = $('.page-sidebar-menu');
                $(".sidebar-search", sidebar).removeClass("open");


                body.addClass("page-sidebar-closed");
                sidebarMenu.addClass("page-sidebar-menu-closed");
                if (body.hasClass("page-sidebar-fixed")) {
                    sidebarMenu.trigger("mouseleave");
                }
                if ($.cookie) {
                    $.cookie('sidebar_closed', '1');
                }

                $(window).trigger('resize');
            }
        },
        getQueryParams: function(){
            // This function is anonymous, is executed immediately and
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            return query_string;
        }
    });

    new CommonSidebarController('#container-commonSidebar');
})(jQuery);