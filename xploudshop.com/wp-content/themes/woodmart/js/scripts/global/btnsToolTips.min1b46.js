!function(a){woodmartThemeModule.$document.on("wdBackHistory wdProductsTabsLoaded wdActionAfterAddToCart wdShopPageInit wdArrowsLoadProducts wdLoadMoreLoadProducts wdUpdateWishlist wdQuickViewOpen wdQuickShopSuccess wdProductBaseHoverIconsResize",function(){woodmartThemeModule.btnsToolTips()}),a.each(["frontend/element_ready/wd_products.default","frontend/element_ready/wd_products_tabs.default"],function(a,b){woodmartThemeModule.wdElementorAddAction(b,function(){woodmartThemeModule.btnsToolTips()})}),woodmartThemeModule.btnsToolTips=function(){a('.woodmart-css-tooltip, .wd-buttons[class*="wd-pos-r"] div > a').on("mouseenter touchstart",function(){var b=a(this);if(!(!b.hasClass("wd-add-img-msg")&&a(window).width()<=1024||b.hasClass("wd-tooltip-inited"))){b.find(".wd-tooltip-label").remove(),b.addClass("wd-tltp").prepend('<span class="wd-tooltip-label">'+b.text()+"</span>");b.find(".wd-tooltip-label");b.addClass("wd-tooltip-inited")}}),woodmartThemeModule.windowWidth<=1024||a(".wd-tooltip, .wd-hover-icons .wd-buttons .wd-action-btn:not(.wd-add-btn) > a, .wd-hover-icons .wd-buttons .wd-add-btn, body:not(.catalog-mode-on):not(.login-see-prices) .wd-hover-base .wd-bottom-actions .wd-action-btn.wd-style-icon:not(.wd-add-btn) > a, body:not(.catalog-mode-on):not(.login-see-prices) .wd-hover-base .wd-bottom-actions .wd-action-btn.wd-style-icon.wd-add-btn, .wd-hover-base .wd-compare-btn > a, .wd-products-nav .wd-back-btn").on("mouseenter touchstart",function(){var b=a(this);b.hasClass("wd-tooltip-inited")||(b.tooltip({animation:!1,container:"body",trigger:"hover",boundary:"window",title:function(){var b=a(this);return b.find(".added_to_cart").length>0?b.find(".add_to_cart_button").text():b.find(".add_to_cart_button").length>0?b.find(".add_to_cart_button").text():b.text()}}),b.tooltip("show"),b.addClass("wd-tooltip-inited"))})},a(document).ready(function(){woodmartThemeModule.btnsToolTips()})}(jQuery);