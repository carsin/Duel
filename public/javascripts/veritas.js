/*
  ----------[ Table of Contents ]----------
   > 1. Smooth scroll
   > 2. Navigation Bar
  -----------------------------------------
*/

// -----------[ 1. Smooth Scroll ]----------

// Overrides default page scroll functionality & instead uses smooth scroll
$(".smooth-scroll").click(function(e) {
    var href = $(this).attr("href");
    $('html, body').stop().animate({
        scrollTop: $(href).offset().top - navHeight + 1
    }, 300);
    e.preventDefault();
});


// -----------[ 2. Navigation Bar ]----------
var isFixed;
var clicked = false;

$(document).ready(function() {
    isFixed = $(".nav").hasClass("fixed");
    // Show nav on click
    $(".mobile-toggle").click(function() {
        toggleNavElements();
        if ($(".mobile-toggle").hasClass("mobile-toggled")) {
            addNavDropdownLinks();
        } else {
            removeNavDropdownLinks();
        }

        if (!clicked) {
            $(".nav-appear .nav-item a").click(hideNav);
            clicked = true;
        }
    });
    scrollEvent();
});

// Remove navbar when clicking on a link
function hideNav() {
	if ($(window).width() <= 800){
  	    toggleNavElements();
        removeNavDropdownLinks();
    }
}

// Show mobile full screen nav
function toggleNavElements() {
    $(".mobile-toggle").toggleClass("mobile-toggled");
    $(".nav-items").toggleClass("nav-appear");
    $(".nav").toggleClass("nav-toggled");
    $("body").toggleClass("no-scroll");
    if (!isFixed) { $(".nav").toggleClass("fixed"); }
}

// Add links from dropdown menus into regular mobile nav
function addNavDropdownLinks() {
    $(".nav-dropdown-item ul li").each(function() {
        $(".nav-items").append("<div class='nav-item nav-appended-dropdown'>" + $(this).html() + "</div>");
    });
}

// Remove Dropdown links from regular mobile nav
function removeNavDropdownLinks() {
    $(".nav-appended-dropdown").each(function() {
        $(this).remove();
    });
}

// Scrollspy variables
var lastId;
var nav = $(".nav");
var navHeight = nav.outerHeight();
var navItems = $(".nav").find(".nav-item a");
var scrollItems = navItems.map(function() {
    var item = $($(this).attr("href"));
    if (item.length) { return item; }
});

// Scroll event
$(window).scroll(scrollEvent);

function scrollEvent() {
    if (nav.hasClass("nav-scrollspy") || nav.hasClass("nav-background-adapt")) {
        // Get container scroll position
        var fromTop = $(this).scrollTop() + navHeight + 1;

        // Get id of current scroll item
        var cur = scrollItems.map(function() {
            if ($(this).offset().top < fromTop)
            return this;
        });

        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (nav.hasClass("nav-scrollspy")) {
            if (lastId !== id) {
                lastId = id;
                // Set / remove active class
                navItems.parent().removeClass("active").end().filter("[href='#" + id + "']").parent().addClass("active");
            }
        }

        if (nav.hasClass("nav-background-adapt")) {
            if (nav.css("background-color") !== $("#" + id).css("background-color")) {
                var itemColor = $("#" + id).css("background-color");

                // If item is transparent, fuck that shit. Use body as fallback color unless nav has nav-allow-adaptive-transparency data attribute.
                if (nav.data("nav-allow-adaptive-transparency") !== true) {
                    if (itemColor === "rgba(0, 0, 0, 0)") { itemColor = $("body").css("background-color"); }
                    // Set background color of nav & nav items to current section's background
                    nav.css("background-color", itemColor);
                    $(".nav-items").css("background-color", itemColor);
                    $(".nav-items").find(".nav-dropdown-item ul").css("background-color", itemColor);
                    setTimeout(function() {
                        var navColor = nav.css("background-color");
                        var navColorsOnly = navColor.substring(navColor.indexOf('(') + 1, navColor.lastIndexOf(')')).split(/,\s*/);
                        navItems.css("color", determineTextColor(navColorsOnly[0], navColorsOnly[1], navColorsOnly[2]));
                        $(".nav").find(".nav-dropdown-title").css("color", determineTextColor(navColorsOnly[0], navColorsOnly[1], navColorsOnly[2]));
                        $(".nav").find(".nav-dropdown-item ul li a").css("color", determineTextColor(navColorsOnly[0], navColorsOnly[1], navColorsOnly[2]));
                        $(".nav").find(".toggle-line").css("background-color", determineTextColor(navColorsOnly[0], navColorsOnly[1], navColorsOnly[2]));
                    }, 90);
                } else {
                    nav.css("background-color", itemColor);
                    $(".nav-items").css("background-color", itemColor);
                    $(".nav-items").find(".nav-dropdown-item ul").css("background-color", itemColor);
                    if (itemColor === "rgba(0, 0, 0, 0)") {
                        $("#nav-adaptive-icon").attr("src", "websrc/img/logo-white.png");
                        navItems.css("color", "white");
                        $(".nav").find(".nav-dropdown-title").css("color", "white");
                        $(".nav").find(".nav-dropdown-item ul li a").css("color", "white");
                        $(".nav").find(".toggle-line").css("background-color", "white");
                    } else {
                        setTimeout(function() {
                            var navColor = nav.css("background-color");
                            var navColorsOnly = navColor.substring(navColor.indexOf('(') + 1, navColor.lastIndexOf(')')).split(/,\s*/);
                            var newColor = determineTextColor(navColorsOnly[0], navColorsOnly[1], navColorsOnly[2]);
                            navItems.css("color", newColor);
                            $(".nav").find(".nav-dropdown-title").css("color", newColor);
                            $(".nav").find(".nav-dropdown-item ul li a").css("color", newColor);
                            $(".nav").find(".toggle-line").css("background-color", newColor);
                            newColor === ("black") ? $("#nav-adaptive-icon").attr("src", "websrc/img/logos.png") : $("#nav-adaptive-icon").attr("src", "websrc/img/logo-white.png");
                        }, 90);
                    }
                }
            }
        }
    }
}

// Determines whether color should be black or white based on input rgb
function determineTextColor(red, green, blue) {
    var c = [red/255, green/255, blue/255];

    for (var i = 0; i < c.length; i++) {
        c[i] <= 0.03928 ?  c[i] = c[i] / 12.92 : c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4);
    }

    if (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 0.179) {
        return "black";
    } else {
        return "white";
    }
}
