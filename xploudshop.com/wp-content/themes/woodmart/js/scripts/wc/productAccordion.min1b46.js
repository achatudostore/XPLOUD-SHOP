!function(a){woodmartThemeModule.productAccordion=function(){var b=a(".wc-tabs-wrapper"),c=300,d=window.location.hash,e=window.location.href;d.toLowerCase().indexOf("comment-")>=0||"#reviews"===d||"#tab-reviews"===d?b.find(".tab-title-reviews").addClass("active"):e.indexOf("comment-page-")>0||e.indexOf("cpage=")>0?b.find(".tab-title-reviews").addClass("active"):b.find(".wd-accordion-title").first().addClass("active"),a(".woocommerce-review-link").on("click",function(){a(".tabs-layout-accordion .wd-accordion-title.tab-title-reviews:not(.active)").click()}),b.on("click",".wd-accordion-title",function(d){d.preventDefault();var e=a(this),f=e.siblings(".woocommerce-Tabs-panel"),g=e.parent().index(),h=e.parent().siblings().find(".active").parent(".wd-tab-wrapper").index();e.hasClass("active")?(h=g,e.removeClass("active"),f.stop().slideUp(c)):(b.find(".wd-accordion-title").removeClass("active"),b.find(".woocommerce-Tabs-panel").slideUp(),e.addClass("active"),f.stop().slideDown(c)),-1===g&&(h=g),woodmartThemeModule.$window.trigger("resize"),setTimeout(function(){if(woodmartThemeModule.$window.trigger("resize"),woodmartThemeModule.$window.width()<1024&&g>h){var b=a(".sticky-header"),c=b.length>0?b.outerHeight():0;a("html, body").animate({scrollTop:e.offset().top-e.outerHeight()-c-50},500)}},c),woodmartThemeModule.$document.trigger("wood-images-loaded")})},a(document).ready(function(){woodmartThemeModule.productAccordion()})}(jQuery);