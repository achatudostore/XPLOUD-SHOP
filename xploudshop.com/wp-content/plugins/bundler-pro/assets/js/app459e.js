jQuery(document).ready(function ($) {
  var $variationForm = false;
  var $form = $("form.cart");

  var originalATCText = $form.find(".single_add_to_cart_button").first().text();

  var variationData = bdlrData.available_variations;

  /**
   * Format the price with Woo structure
   *
   * @param mixed price
   *
   * @return mixed
   */
  function formatPrice(price) {
    const currencyData =
      bdlrData.currency_data && bdlrData.currency_data.currencies
        ? bdlrData.currency_data.currencies[
            bdlrData.currency_data.current_currency
          ]
        : null;

    const formatParams = {
      decimal_sep:
        currencyData?.decimal_sep && currencyData.decimal_sep !== ""
          ? currencyData.decimal_sep
          : bdlrData.wc_store_object.decimal_sep,
      position:
        currencyData?.pos && currencyData.pos !== ""
          ? currencyData.pos
          : bdlrData.wc_store_object.position,
      symbol:
        currencyData?.symbol && currencyData.symbol !== ""
          ? currencyData.symbol
          : bdlrData.wc_store_object.symbol,
      thousand_sep:
        currencyData?.thousand_sep && currencyData.thousand_sep !== ""
          ? currencyData.thousand_sep
          : bdlrData.wc_store_object.thousand_sep,
      decimals:
        currencyData?.decimals && currencyData.decimals !== ""
          ? currencyData.decimals
          : bdlrData.wc_store_object.decimals,
      html: true,
    };

    // Convert price to a number and round it to the specified number of decimal places
    var roundedPrice = parseFloat(price).toFixed(formatParams.decimals);

    // Replace the decimal separator with the appropriate separator
    var formattedPrice = roundedPrice.replace(".", formatParams.decimal_sep);

    // Format the currency symbol
    var formattedSymbol = formatParams.html
      ? '<span class="woocommerce-Price-currencySymbol">' +
        formatParams.symbol +
        "</span>"
      : formatParams.symbol;

    // Add the currency symbol to the formatted price based on the currency position

    switch (formatParams.position) {
      case "left":
        formattedPrice = `${formattedSymbol}${formattedPrice}`;
        break;
      case "right":
        formattedPrice = `${formattedPrice}${formattedSymbol}`;
        break;
      case "left_space":
        formattedPrice = `${formattedSymbol} ${formattedPrice}`;
        break;
      case "right_space":
        formattedPrice = `${formattedPrice} ${formattedSymbol}`;
        break;
      default:
        formattedPrice = `${formattedSymbol}${formattedPrice}`; // Default format
    }

    // Add HTML wrappers if needed
    formattedPrice = formatParams.html
      ? '<span class="woocommerce-Price-amount amount">' +
        formattedPrice +
        "</span>"
      : formattedPrice;

    return formattedPrice;
  }

  /**
   * Reload the prices in the storefront widget
   *
   * @return void
   */
  function reloadPrices() {
    const currency = bdlrData.currency_data.current_currency;

    var discountOptions = $(".wbdl_widget").find(".quantity-break");

    if (discountOptions.length) {
      discountOptions.each((key, option) => {
        const currencyPrices = $(option).data("currency_prices");
        if (currencyPrices) {
          const salePrice = currencyPrices[currency]?.sale_price || 0;
          const regularPrice = currencyPrices[currency]?.regular_price || 0;

          if (salePrice !== 0 && regularPrice !== 0)
            $(option).update_displayed_price(salePrice, regularPrice);
        }
      });
    }
  }

  /**
   * Update the options based on the selected attribute, according to the available variations
   * @param mixed matchingVariations
   * @param mixed changedAttribute
   *
   * @return void
   */
  function updateOptions(
    matchingVariations,
    changedAttribute,
    customVariation
  ) {
    $(customVariation)
      .find("select")
      .each(function () {
        var $select = $(this);
        var attribute = $select.data("attribute_name");

        // Skip the select that triggered the change
        if (attribute === changedAttribute) {
          return;
        }

        var availableOptions = new Set();

        // Collect available options for this attribute
        matchingVariations.forEach(function (variation) {
          if (variation.is_in_stock) {
            // Check if the variation is in stock
            var value = variation.attributes[attribute];
            if (value) {
              availableOptions.add(value);
            }
          }
        });

        // Disable options that are not available
        var currentValue = $select.val();
        var newValue = null;
        $select.find("option").each(function () {
          var optionValue = $(this).val();
          if (availableOptions.has(optionValue)) {
            $(this).prop("disabled", false);
            if (newValue === null) {
              newValue = optionValue;
            }
          } else {
            $(this).prop("disabled", true);
          }
        });

        // Move to the next available value if the current value is not valid
        if (!availableOptions.has(currentValue)) {
          $select.val(newValue);
        }
      });
  }

  /**
   * Stores a default attribute for an element so it can be reset later
   * @param {*} attr
   * @param {*} value
   */
  $.fn.wc_set_variation_attr = function (attr, value) {
    if (undefined === this.attr("data-o_" + attr)) {
      this.attr("data-o_" + attr, !this.attr(attr) ? "" : this.attr(attr));
    }
    if (false === value) {
      this.removeAttr(attr);
    } else {
      this.attr(attr, value);
    }
  };

  $.fn.update_displayed_price = function (salePrice, regularPrice) {
    this.find(".quantity-break__price")
      .find(".bundle-price")
      .attr("value", salePrice);
    this.find(".quantity-break__price")
      .find(".bundle-cprice")
      .attr("value", regularPrice);

    salePrice = formatPrice(salePrice);
    regularPrice = formatPrice(regularPrice);

    this.find(".quantity-break__price").find(".bundle-price").html(salePrice);
    this.find(".quantity-break__price")
      .find(".bundle-cprice")
      .html(regularPrice);
  };

  /**
   * Update the displayed product price
   *
   * @param mixed salePrice
   * @param mixed regularPrice
   *
   * @return void
   */
  function updateDisplayedProductPrice(salePrice, regularPrice) {
    // var price = $(".summary").find(".price").first();
    var price = $form.parent().find(".price");
    price.empty();

    if (regularPrice && regularPrice != 0 && regularPrice != salePrice) {
      // If compared price + sale price
      salePrice = formatPrice(salePrice);
      regularPrice = formatPrice(regularPrice);

      price.append("<del></del><ins></ins>");
      price.find("del").html(regularPrice);
      price.find("ins").html(salePrice);
    } else {
      // If sale price only (no regular price)
      salePrice = formatPrice(salePrice);
      price.append(salePrice);
    }
  }

  /**
   * Update bundle image
   * @param {*} image
   */
  function updateOfferImage(image) {
    if (image) {
      var $product = $(".wbdl_widget").closest(".product"),
        $productGallery = $product.find(".images"),
        $galleryNav = $product.find(".flex-control-nav"),
        $galleryImg = $galleryNav.find("li:eq(0) img"),
        $productImgWrap = $productGallery
          .find(
            ".woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder"
          )
          .eq(0),
        $productImg = $productImgWrap.find("img"),
        $productLink = $productImgWrap.find("a").eq(0);

      $productImg.wc_set_variation_attr("srcset", image);
      $productImg.wc_set_variation_attr("data-src", image);
      $productImg.wc_set_variation_attr("data-large_image", image);
      $productImgWrap.wc_set_variation_attr("data-thumb", image);
      $galleryImg.wc_set_variation_attr("src", image);
      $productLink.wc_set_variation_attr("href", image);
      $productImg.wc_set_variation_attr("src", image);

      $productGallery.trigger("woocommerce_gallery_reset_slide_position");
    }
  }

  /**
   * select a bundle offer and unselect the others
   * @param mixed bundle
   * @return void
   */
  function selectOffer(bundle) {
    var bundleId = $(bundle).data("bundle_id");

    // get all the bundle widgets with the same id
    var bundles = $(document)
      .find(".wbdl_widget")
      .find("div.quantity-break[data-bundle_id='" + bundleId + "']");

    bundles.each(function () {
      // Hide non-active bundles details and show active bundle details.
      var parent = $(this).closest(".wbdl_widget");

      parent.find(".quantity-break").each(function (i, obj) {
        $(obj).removeClass("active");
      });

      // Activate the clicked bundle
      $(this).addClass("active");

      // Hide the bundle details
      parent
        .find("div[class^='quantity-break']:not(.active)")
        .find(".quantity-break__variants")
        .css("display", "none");
      parent
        .find("div[class^='quantity-break']:not(.active)")
        .find(".quantity-break__variant-selector .option2")
        .removeAttr("name");
      parent
        .find("div[class^='quantity-break']:not(.active)")
        .find(
          ".quantity-break__variant-selector .quantity-break__attribute-option"
        )
        .removeAttr("name");

      // Display the selected bundle's details
      $(this).find(".quantity-break__variants").css("display", "flex");
      if ($(this).find('.img_thumbnail[src!=""]').length) {
        $(this).find(".quantity-break__attribute-label").css("width", "100%");
      }
      $(this).find(".radio_select").prop("checked", true);
    });

    // Update the displayed regular and sale price on the product page according to the selected bundle's price
    var regularPrice = $(bundle).find(".bundle-cprice").attr("value") || 0;
    var salePrice = $(bundle).find(".bundle-price").attr("value") || 0;

    updateDisplayedProductPrice(salePrice, regularPrice);

    // Update product's featured image
    var bundleImage = $(bundle).find(".img_thumbnail").attr("src");
    if (bundleImage) {
      if (bundleImage.startsWith("data:image")) {
        var bundleImage = $(bundle).find(".img_thumbnail").attr("data-src");
      }
      updateOfferImage(bundleImage);
    }

    // Change the add to cart button text (also works when the button has children) (PRO)
    if (bdlrData.atc_price_text == "on") {
      salePrice = formatPrice(salePrice);
      $(".single_add_to_cart_button").html(originalATCText + " | " + salePrice);
    }
  }

  /**
   * Add offer to cart
   * @param mixed $atcButton
   * @param mixed $bundlerWidget
   * @return void
   */
  function addOfferToCart($atcButton, $bundlerWidget) {
    var id = $atcButton.val(),
      nonce = $bundlerWidget.find("input[name=wbdl_nonce]").val(),
      productId = $bundlerWidget.data("product_id") || id,
      productType =
        $bundlerWidget.find("input[name=wbdl_product_type]").val() || "simple",
      variationID = $bundlerWidget.find("input[name=variation_id]").val() || 0,
      productQty = $form.find("input[name=quantity]").val() || 1,
      productsNb =
        $bundlerWidget.find(".quantity-break.active").data("products_number") ||
        1,
      title =
        $bundlerWidget
          .find(".quantity-break.active")
          .find(".quantity-break__title")
          .attr("data-title") || "",
      regularPrice =
        $bundlerWidget
          .find(".quantity-break.active")
          .find('span[name^="bundle_cprice"]')
          .attr("value") || 0,
      salePrice =
        $bundlerWidget
          .find(".quantity-break.active")
          .find('span[name^="bundle_price"]')
          .attr("value") || 0,
      image =
        $bundlerWidget
          .find(".quantity-break.active")
          .find("img[name=bundle_image]")
          .attr("src") || "",
      use_custom_variations =
        $bundlerWidget.find("input[name=use_custom_variations]").val() || "off";

    if (
      productType == "variable" ||
      productType == "variable-subscription" ||
      use_custom_variations == "on"
    ) {
      var varArray = [];
      var attrArray, attribute, value;

      $bundlerWidget
        .find(".quantity-break.active")
        .find(".quantity-break__variant-selector")
        .each(function (index) {
          attrArray = [];

          $(this)
            .find(".quantity-break__attribute-option")
            .each(function (index) {
              attribute = $(this).data("attribute_name");
              value = this.value;
              attrArray.push({
                attribute: attribute,
                value: value,
              });
            });

          var existingVariation = varArray.find(function (existingVar) {
            return (
              JSON.stringify(existingVar.variation) ===
              JSON.stringify(attrArray)
            );
          });

          if (existingVariation) {
            existingVariation.quantity++;
          } else {
            varArray.push({
              variation: attrArray,
              quantity: 1,
            });
          }
        });
    }

    varArray = JSON.stringify(varArray);

    var ajax_url;

    if (use_custom_variations == "on") {
      var data = {
        nonce: nonce,
        product_id: productId,
        product_quantity: productQty,
        title: title,
        sale_price: salePrice,
        regular_price: regularPrice,
        image: image,
        variations_array: varArray,
      };

      ajax_url = woocommerce_params.wc_ajax_url
        .toString()
        .replace("%%endpoint%%", "wbdl_add_to_cart_custom_var");
    } else {
      var data = {
        nonce: nonce,
        product_id: productId,
        products_num: productsNb,
        product_quantity: productQty,
        variation_id: variationID,
        title: title,
        image: image,
        variations_array: varArray,
      };

      ajax_url = woocommerce_params.wc_ajax_url
        .toString()
        .replace("%%endpoint%%", "wbdl_add_to_cart");
    }

    const cart_redirect = bdlrData.cart_redirect;
    const checkout_redirect = bdlrData.checkout_redirect;

    $(document.body).trigger("adding_to_cart", [$atcButton, data]);

    $.ajax({
      url: ajax_url,
      type: "POST",
      dataType: "json",
      data: data,
      beforeSend: function (response) {
        $atcButton.removeClass("added").addClass("loading");
      },
      complete: function (response) {
        $atcButton.addClass("added").removeClass("loading");
        // $(document.body).trigger("wc_reload_fragments");
        // console.log("complete " + JSON.stringify(response.responseJSON));
      },
      success: function (response) {
        if (response.error) {
          alert(response.message);
          return;
        }
        $(document.body).trigger("added_to_cart", [
          response.fragments,
          response.cart_hash,
          $atcButton,
        ]);
        $(document.body).trigger("wc_fragment_refresh");

        if (checkout_redirect === "on") {
          window.location = bdlrData.woo_checkout_url;
        } else if (cart_redirect == "on") {
          window.location = bdlrData.woo_cart_url;
        }
      },
    });
  }

  /**
   * Calculate the bundle's sale price and regular price based on the selected variants
   * @param mixed price
   * @param mixed discountOption
   *
   * @return string
   */
  function setOfferPrice(discountOption) {
    var salePrice = 0,
      regularPrice = 0;

    const discountType = discountOption.data("discount_type");
    if (discountType == "discount") {
      const discountValue = discountOption.data("discount_value");
      const discountMethod = discountOption.data("discount_method");

      var variations = [];

      // get all the attributes for all the variants included in the bundle
      $(discountOption)
        .find(".quantity-break__variants")
        .find(".quantity-break__variant-selector")
        .each(function () {
          var attributes = {};
          $(this)
            .find("select")
            .each(function () {
              attributes[$(this).data("attribute_name")] = this.value;
            });
          variations.push(attributes);
        });

      // for each variation, calculate its price and add it to the bundle price
      variations.forEach(function (attributes) {
        if (Object.keys(attributes).length) {
          var matching_variations = $variationForm.findMatchingVariations(
              variationData,
              attributes
            ),
            variation = matching_variations.shift();

          if (variation) {
            salePrice += variation.display_price;
            regularPrice += variation.display_regular_price;
          }
        }
      });

      if (discountMethod === "percent_off") {
        salePrice = salePrice * (1 - discountValue / 100);
      } else if (discountMethod === "value_off") {
        salePrice = salePrice - discountValue;
      }
    } else {
      salePrice = $(discountOption).find(".bundle-price").attr("value");
      regularPrice = $(discountOption).find(".bundle-cprice").attr("value");
    }

    // update the product price
    updateDisplayedProductPrice(salePrice, regularPrice);

    // update the discount option price
    discountOption.update_displayed_price(salePrice, regularPrice);

    // update the ATC text
    if (bdlrData.atc_price_text == "on") {
      salePrice = formatPrice(salePrice);
      $(".single_add_to_cart_button").html(originalATCText + " | " + salePrice);
    }
  }

  /**
   * Event listeners
   */

  /* Capture $variationForm on product page loaded */
  $form.on("wc_variation_form", function (event, variationForm) {
    $variationForm = variationForm;
  });

  /* click on the preselected bundle offer */
  $(".wbdl_widget")
    .find("div[class^='quantity-break']:not(.active)")
    .find(".quantity-break__variants")
    .css("display", "none");
  $(".wbdl_widget")
    .find(".quantity-break__radio.active")
    .each(function (i, obj) {
      setTimeout(function () {
        $(obj).closest("div[class^='quantity-break']").trigger("click");
      }, 1000);
    });

  /* action after a bundle offer is selected */
  $(".wbdl_widget")
    .find(".quantity-break")
    .on("click", function (e) {
      if ($(this).hasClass("active")) return;
      $(".single_add_to_cart_button").removeClass("disabled");
      selectOffer(this);
    });

  /* action after add to cart button is clicked */
  $(".single_add_to_cart_button").on("click touchend", function (e) {
    if ($(this).hasClass("disabled")) return;
    var $atcButton = $(this),
      $form = $atcButton.closest("form.cart");

    var $bundlerWidget = $form.find("div[class='wbdl_widget']").length
      ? $form.find("div[class='wbdl_widget']")
      : $(document).find("div[class='wbdl_widget']");

    if ($bundlerWidget.length) {
      // If Any bundles for this product
      if ($bundlerWidget.find(".radio_select").is(":checked")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Stop propagation to prevent AJAX add-to-cart
        addOfferToCart($atcButton, $bundlerWidget);
      } else {
        e.preventDefault();
        e.stopImmediatePropagation(); // Stop propagation to prevent AJAX add-to-cart
        alert(bdlrData.i18n.select_offer_message);
      }
    }
  });

  /* action after custom add to cart button is clicked (case of sales page) */
  $(".custom_add_to_cart_button:not(.disabled)").on("click", function (e) {
    var $atcButton = $(this);

    // Look for the bundler widget near the add to cart form. If there is no add to cart form, look for the widget in the entire page.
    var $bundlerWidget = $atcButton.parent().find(".wbdl_widget").length
      ? $atcButton.parent().find(".wbdl_widget")
      : $(document).find("div[class='wbdl_widget']");

    if ($bundlerWidget.length) {
      // If Any bundles for this product
      e.preventDefault();
      if ($bundlerWidget.find(".radio_select").is(":checked")) {
        addOfferToCart($atcButton, $bundlerWidget);
      } else {
        alert(bdlrData.i18n.select_option_alert);
      }
    }
  });

  /* action when a variation is chosen */
  $(".wbdl_widget")
    .find(".quantity-break__variant-selector")
    .find("select")
    .on("change", function () {
      if (!$form.length || !$variationForm || !variationData) {
        // Handle case where wc_variation_form or variationData is not available
        console.log("Variation form or data not available.");
        return;
      }

      var attributes = {};
      var discountOption = $(this).closest(".quantity-break");
      var customVariation = $(this).closest(
        ".quantity-break__variant-selector"
      );

      var changedAttribute = {};
      const attributeName = $(this).data("attribute_name");
      const attributeValue = this.value;
      changedAttribute[attributeName] = attributeValue;

      if (Object.keys(changedAttribute).length) {
        var availableVariations = $variationForm.findMatchingVariations(
          variationData,
          changedAttribute
        );
        // console.log("available variations", availableVariations);
        updateOptions(availableVariations, attributeName, customVariation);
      }

      // get the attributes of the selected variants
      $(this)
        .closest(".quantity-break__variant-selector")
        .find("select")
        .each(function () {
          attributes[$(this).data("attribute_name")] = this.value;
        });

      if (Object.keys(attributes).length) {
        var matchingVariations = $variationForm.findMatchingVariations(
            variationData,
            attributes
          ),
          variation = matchingVariations.shift();

        if (variation) {
          // trigger the image change
          $variationForm.$form.trigger("found_variation", [variation]);
          setOfferPrice(discountOption);
        }
      }
    });

  if (bdlrData.is_wmc_active === "1") {
    $(document).on("wmc_cache_compatible_finish", function (event, data) {
      let currentCurrency = data.current_currency || "";
      if (
        currentCurrency &&
        currentCurrency !== bdlrData.currency_data.current_currency
      ) {
        bdlrData.currency_data.current_currency = currentCurrency;
        reloadPrices();
      }
    });
  }
});
