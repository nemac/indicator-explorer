// widget code
(function($) {
  $.widget('nemac.mapCompare', {
    //
    // Defaults
    //
    options: {
      config: {}
    },

    //
    // Private methods
    //

    /**
     * Parses the config file||string for the maps and invokes functions that create the
     * necessary elements.
     */
    _create: function() {
      this.element.empty();
      var widget = this;
      var elemId = '#' + $(this.element).attr('id');

      if (typeof this.options.config === 'string') {
        $.getJSON(this.options.config, function(data){
          widget.element.html(buildTemplate(data));
          widget._deployApp(data, elemId);
        });
      } else {
        this.element.html(buildTemplate(this.options.config));
        this._deployApp(this.options.config, elemId);
      }
    },

    /**
     * Creates all of the UI elements & images. Binds appropriate handlers to them.
     *
     * @param Object config - Parsed configuration options
     * @param String elemId - Reference to the top level element that contains the images & UI
     */
    _deployApp: function(config, elemId) {
      // populate left select
      if (config['leftSelector']) {
        populateSide(elemId, 'left', config['leftSelector']);
      }

      // populate right select
      if (config['rightSelector']) {
        populateSide(elemId, 'right', config['rightSelector']);
      }

      // fire select to set the images
      $(elemId).find('.image-selector').trigger('change');

      if (config['type'] === "fade") {
        $(elemId).find('.fader').append('<label class="slide-label">both</label><div class="slide-group"><span class="slide-label">' + config['leftSelector']['slideLabel'] + '</span><input type="range" min="0" max="1" step="0.01" value="' + config['defaultSlidePosition'] + '" /><span class="slide-label">' + config['rightSelector']['slideLabel'] + '</span></div>');
        $(elemId).find('.fader').val('0').on('input change', function(e) {
          $(elemId).find('.image-left').css('opacity', 1 - e.target.value);
        });

        // set initial opacity
        $(elemId).find('.image-left').css('opacity', 1 - config['defaultSlidePosition']);

      } else {
        // init image box
        setTimeout(function() {
          $(elemId).find('.image-slider').twentytwenty({
            default_offset_pct: config['defaultSlidePosition']
          });
        }, 300);
      }

      // ready, so show
      $(elemId).find('div.main-container').show();
    }
  });

  //
  // STATICS
  //

  /**
   * Creates the UI elements & images for one "side". Allows for multiple layers of images
   * to be created for comparison.
   *
   * @param String elemId - Reference to the top level element that contains the images & UI
   * @param String side - "left || "right". Used to build appropriate selectors
   * @param Object sideData - Parsed configuration options for this "side"
   */
  function populateSide(elemId, side, sideData) {
    var $containerRef = $(elemId).find(' div.' + side + '-container');

    // change label in container
    $containerRef.find('label').html(sideData['name']);

    // deploy template based on selector type
    var type = sideData['type'] === 'radio' ? 'radio' : 'drop-down';

    $containerRef.append(SELECTOR_TEMPLATES[type]);

    // deploy options to selector, bind change event
    var $selector = $containerRef.find('.image-selector');
    var $imageRef = $(elemId + ' img.image-' + side);
    var $legendRef = $(elemId + ' img.image-' + side + '-legend');
    var images = sideData['images'];

    if (type === 'radio') {
      populateRadioSelector($selector, $imageRef, $legendRef, images);
      // take up a whole row
      $selector.parent().removeClass('four').addClass('twelve');
      $containerRef.find('.filler-container').hide();
    } else {
      populateDropDown($selector, $imageRef, $legendRef, images);
    }

    // make selector section invisible if only one image
    if (sideData['images'].length === 1) {
      $containerRef.hide();
    }
  }

  /**
   * Creates the UI elements for radio type comparisons & binds relevant events. Store extra
   * configuration needed for switching images in "data" attributes.
   *
   * @param jQuery Object $selector - jQuery wrapped pointer to the DOM element that contains the UI
   * @param jQuery Object $imageRef - jQuery wrapped pointer to the DOM element that contains the map
   * @param jQuery Object $legendRef - jQuery wrapped pointer to the DOM element that contains an
   *                                   external legend for the map
   * @param Array images - Array of objects that contain the options for each image in this "side"
   */
  function populateRadioSelector($selector, $imageRef, $legendRef, images) {
    var labelClass = buttonClass(images.length);

    $.each(images, function() {
      var $label = $('<label />').addClass(labelClass);
      $label.append($('<input type="radio" name="sl" />')
                    .val(this['source'])
                    .data('alt', this['alt'])
                    .data('legend', this['legend'])
                    .data('legend-alt', this['legend-alt'])
                   );
      $label.append($('<span class="label-body" />').text(this['name']));

      $selector.append($label);

      if (this['default']) {
        $('input[name=sl][value="' + this['source'] + '"]').prop('checked', true);
        $label.addClass("on");
        $imageRef.attr('alt', this["alt"])
            .attr('title', this["alt"]);
        $legendRef.attr('src', this["legend"])
            .attr('alt', this["legend-alt"])
            .attr('title', this["legend-alt"]);
      }

      $label.click(function () {
        $(this).siblings().removeClass("on");
        $(this).addClass("on");
      });
    });

    $selector.on('change', function() {
      var $elem = $("input[name='sl']:checked");
      $imageRef.attr('src', $elem.val())
            .attr('alt', $elem.data("alt"))
            .attr('title', $elem.data("alt"));
      $legendRef.attr('src', $elem.data("legend"))
            .attr('alt', $elem.data("legendAlt"))
            .attr('title', $elem.data("legendAlt"));
    });
  }

  /**
   * Generates class that controls display width of radio button inputs
   *
   * @param number length
   * @return string 
   */
  function buttonClass (length) {
    var btnClass = "nem-mcw-button-";
    switch (length) {
      case 1:
        btnClass += "whole";
        break;
      case 2:
        btnClass += "half";
        break;
      case 3:
        btnClass += "third";
        break;
      case 4:
        btnClass += "fourth";
        break;
      case 5:
        btnClass += "fifth";
        break;
      default:
        btnClass += "default";
        break;
    }

    return btnClass;
  }

  /**
   * Creates the UI elements for dropdown type comparisons & binds relevant events. Store extra
   * configuration needed for switching images in "data" attributes.
   *
   * @param jQuery Object $selector - jQuery wrapped pointer to the DOM element that contains the UI
   * @param jQuery Object $imageRef - jQuery wrapped pointer to the DOM element that contains the map
   * @param jQuery Object $legendRef - jQuery wrapped pointer to the DOM element that contains an
   *                                   external legend for the map
   * @param Array images - Array of objects that contain the options for each image in this "side"
   */
  function populateDropDown($selector, $imageRef, $legendRef, images) {
    $.each(images, function() {
      $selector.append($('<option />')
                       .val(this['source'])
                       .text(this['name'])
                       .data('alt', this['alt'])
                       .data('legend', this['legend'])
                       .data('legend-alt', this['legend-alt']));
      if (this['default']) {
        $selector.val(this['source']);
        $imageRef.attr('alt', this["alt"])
            .attr('title', this["alt"]);
        $legendRef.attr('src', this["legend"])
            .attr('alt', this["legend-alt"])
            .attr('title', this["legend-alt"]);
      }
    });

    $selector.on('change', function() {
      $imageRef.attr('src', $(this).val())
            .attr('alt', $(this).data("alt"))
            .attr('title', $(this).data("alt"));
      $legendRef.attr('src', $(this).data("legend"))
            .attr('alt', $(this).data("legendAlt"))
            .attr('title', $(this).data("legendAlt"));
    });
  }

  /**
   * Provides the wrapper for the UI based the type of controls. Used in the function populateSide.
   */
  var SELECTOR_TEMPLATES = {
    'radio': '<form class="image-selector"></form>',
    'drop-down': '<select class="nem-mcw-u-full-width image-selector"></select>'
  }

  /**
   * Builds the HTML that contains all of the UI and the maps based on the options available in the
   * configuration.
   *
   * @param Object config - Parsed configuration options
   * @return String html - HTML string which populates the map widget
   */
  function buildTemplate (config) {
    var left = config['leftSelector'];
    var right = config['rightSelector'];

    var html = '<div class="nem-mcw-container main-container" style="display: none;">' +
          '<div class="nem-mcw-row">';

    if (left) {
      html += '<div class="four nem-mcw-columns left-container">' +
            '<label></label>' +
            '</div>';
    }

    if (left && left['type'] === 'radio' || right && right['type'] === 'radio') {
      html += '<div class="four nem-mcw-columns filler-container"></div>';
    }

    if (right) {
      html += '<div class="four nem-mcw-columns right-container">' +
            '<label></label>' +
            '</div>';
    }

    html += '</div>' +
          '<div class="nem-mcw-row">' +
          '<div class="twelve nem-mcw-columns twentytwenty-container">' +
          '<div class="image-slider">';

    if (left) {
      html +='<img class="image-left twentytwenty-before" />';
    }

    if (right) {
      html +='<img class="image-right twentytwenty-after" />';
    }

    if (left && right) {
      html += '<div class="fader"></div>';
    }

    html += '</div>';

    if (left && left['images'][0]['legend']) {
      html += '<img class="image-left-legend twentytwenty-legend" />';
    }

    if (right && right['images'][0]['legend']) {
      html += '<img class="image-right-legend twentytwenty-legend" />';
    }

    html += '</div>' +
          '</div>' +
          '</div>';

    return html;
  }

  // ---------------------------------------------------------------------------
  //
  // Included code
  //

  // twentytwenty
  /**
   * Included widget which handles the slide to compare functionality
   */
  $.fn.twentytwenty = function(options) {
    var options = $.extend({default_offset_pct: 0.5, orientation: 'horizontal'}, options);
    return this.each(function() {

      var sliderPct = options.default_offset_pct;
      var container = $(this);
      var sliderOrientation = options.orientation;
      var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
      var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';


      container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
      container.append("<div class='twentytwenty-overlay'></div>");
      var beforeImg = container.find("img:first");
      var afterImg = container.find("img:last");
      container.append("<div class='twentytwenty-handle'></div>");
      var slider = container.find(".twentytwenty-handle");
      slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
      slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
      container.addClass("twentytwenty-container");
      beforeImg.addClass("twentytwenty-before");
      afterImg.addClass("twentytwenty-after");

      var overlay = container.find(".twentytwenty-overlay");
      overlay.append("<div class='twentytwenty-before-label'></div>");
      overlay.append("<div class='twentytwenty-after-label'></div>");

      var calcOffset = function(dimensionPct) {
        var w = beforeImg.width();
        var h = beforeImg.height();
        return {
          w: w+"px",
          h: h+"px",
          cw: (dimensionPct*w)+"px",
          ch: (dimensionPct*h)+"px"
        };
      };

      var adjustContainer = function(offset) {
        if (sliderOrientation === 'vertical') {
          beforeImg.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
        }
        else {
          beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
      }
        container.css("height", offset.h);
      };

      var adjustSlider = function(pct) {
        var offset = calcOffset(pct);
        slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
        adjustContainer(offset);
      }

      $(window).on("resize.twentytwenty", function(e) {
        adjustSlider(sliderPct);
      });

      var offsetX = 0;
      var imgWidth = 0;

      slider.on("movestart", function(e) {
        if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
          e.preventDefault();
        }
        else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
          e.preventDefault();
        }
        container.addClass("active");
        offsetX = container.offset().left;
        offsetY = container.offset().top;
        imgWidth = beforeImg.width();
        imgHeight = beforeImg.height();
      });

      slider.on("moveend", function(e) {
        container.removeClass("active");
      });

      slider.on("move", function(e) {
        if (container.hasClass("active")) {
          sliderPct = (sliderOrientation === 'vertical') ? (e.pageY-offsetY)/imgHeight : (e.pageX-offsetX)/imgWidth;
          if (sliderPct < 0) {
            sliderPct = 0;
          }
          if (sliderPct > 1) {
            sliderPct = 1;
          }
          adjustSlider(sliderPct);
        }
      });

      container.find("img").on("mousedown", function(event) {
        event.preventDefault();
      });

      $(window).trigger("resize.twentytwenty");
    });
  };

  // jquery Event Move
  (function (module) {
        if (typeof define === 'function' && define.amd) {
                // AMD. Register as an anonymous module.
                define(['jquery'], module);
        } else {
                // Browser globals
                module(jQuery);
        }
  })(function(jQuery, undefined){

        var // Number of pixels a pressed pointer travels before movestart
            // event is fired.
            threshold = 6,

            add = jQuery.event.add,

            remove = jQuery.event.remove,

            // Just sugar, so we can have arguments in the same order as
            // add and remove.
            trigger = function(node, type, data) {
                jQuery.event.trigger(type, data, node);
            },

            // Shim for requestAnimationFrame, falling back to timer. See:
            // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
            requestFrame = (function(){
                return (
                        window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(fn, element){
                                return window.setTimeout(function(){
                                        fn();
                                }, 25);
                        }
                );
            })(),

            ignoreTags = {
                textarea: true,
                input: true,
                select: true,
                button: true
            },

            mouseevents = {
                move: 'mousemove',
                cancel: 'mouseup dragstart',
                end: 'mouseup'
            },

            touchevents = {
                move: 'touchmove',
                cancel: 'touchend',
                end: 'touchend'
            };


        // Constructors

        function Timer(fn){
                var callback = fn,
                    active = false,
                    running = false;

                function trigger(time) {
                        if (active){
                                callback();
                                requestFrame(trigger);
                                running = true;
                                active = false;
                        }
                        else {
                                running = false;
                        }
                }

                this.kick = function(fn) {
                        active = true;
                        if (!running) { trigger(); }
                };

                this.end = function(fn) {
                        var cb = callback;

                        if (!fn) { return; }

                        // If the timer is not running, simply call the end callback.
                        if (!running) {
                                fn();
                        }
                        // If the timer is running, and has been kicked lately, then
                        // queue up the current callback and the end callback, otherwise
                        // just the end callback.
                        else {
                                callback = active ?
                                        function(){ cb(); fn(); } :
                                        fn ;

                                active = true;
                        }
                };
        }


        // Functions

        function returnTrue() {
                return true;
        }

        function returnFalse() {
                return false;
        }

        function preventDefault(e) {
                e.preventDefault();
        }

        function preventIgnoreTags(e) {
                // Don't prevent interaction with form elements.
                if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

                e.preventDefault();
        }

        function isLeftButton(e) {
                // Ignore mousedowns on any button other than the left (or primary)
                // mouse button, or when a modifier key is pressed.
                return (e.which === 1 && !e.ctrlKey && !e.altKey);
        }

        function identifiedTouch(touchList, id) {
                var i, l;

                if (touchList.identifiedTouch) {
                        return touchList.identifiedTouch(id);
                }

                // touchList.identifiedTouch() does not exist in
                // webkit yet… we must do the search ourselves...

                i = -1;
                l = touchList.length;

                while (++i < l) {
                        if (touchList[i].identifier === id) {
                                return touchList[i];
                        }
                }
        }

        function changedTouch(e, event) {
                var touch = identifiedTouch(e.changedTouches, event.identifier);

                // This isn't the touch you're looking for.
                if (!touch) { return; }

                // Chrome Android (at least) includes touches that have not
                // changed in e.changedTouches. That's a bit annoying. Check
                // that this touch has changed.
                if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

                return touch;
        }


        // Handlers that decide when the first movestart is triggered

        function mousedown(e){
                var data;

                if (!isLeftButton(e)) { return; }

                data = {
                        target: e.target,
                        startX: e.pageX,
                        startY: e.pageY,
                        timeStamp: e.timeStamp
                };

                add(document, mouseevents.move, mousemove, data);
                add(document, mouseevents.cancel, mouseend, data);
        }

        function mousemove(e){
                var data = e.data;

                checkThreshold(e, data, e, removeMouse);
        }

        function mouseend(e) {
                removeMouse();
        }

        function removeMouse() {
                remove(document, mouseevents.move, mousemove);
                remove(document, mouseevents.cancel, mouseend);
        }

        function touchstart(e) {
                var touch, template;

                // Don't get in the way of interaction with form elements.
                if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

                touch = e.changedTouches[0];

                // iOS live updates the touch objects whereas Android gives us copies.
                // That means we can't trust the touchstart object to stay the same,
                // so we must copy the data. This object acts as a template for
                // movestart, move and moveend event objects.
                template = {
                        target: touch.target,
                        startX: touch.pageX,
                        startY: touch.pageY,
                        timeStamp: e.timeStamp,
                        identifier: touch.identifier
                };

                // Use the touch identifier as a namespace, so that we can later
                // remove handlers pertaining only to this touch.
                add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
                add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
        }

        function touchmove(e){
                var data = e.data,
                    touch = changedTouch(e, data);

                if (!touch) { return; }

                checkThreshold(e, data, touch, removeTouch);
        }

        function touchend(e) {
                var template = e.data,
                    touch = identifiedTouch(e.changedTouches, template.identifier);

                if (!touch) { return; }

                removeTouch(template.identifier);
        }

        function removeTouch(identifier) {
                remove(document, '.' + identifier, touchmove);
                remove(document, '.' + identifier, touchend);
        }


        // Logic for deciding when to trigger a movestart.

        function checkThreshold(e, template, touch, fn) {
                var distX = touch.pageX - template.startX,
                    distY = touch.pageY - template.startY;

                // Do nothing if the threshold has not been crossed.
                if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

                triggerStart(e, template, touch, distX, distY, fn);
        }

        function handled() {
                // this._handled should return false once, and after return true.
                this._handled = returnTrue;
                return false;
        }

        function flagAsHandled(e) {
                e._handled();
        }

        function triggerStart(e, template, touch, distX, distY, fn) {
                var node = template.target,
                    touches, time;

                touches = e.targetTouches;
                time = e.timeStamp - template.timeStamp;

                // Create a movestart object with some special properties that
                // are passed only to the movestart handlers.
                template.type = 'movestart';
                template.distX = distX;
                template.distY = distY;
                template.deltaX = distX;
                template.deltaY = distY;
                template.pageX = touch.pageX;
                template.pageY = touch.pageY;
                template.velocityX = distX / time;
                template.velocityY = distY / time;
                template.targetTouches = touches;
                template.finger = touches ?
                        touches.length :
                        1 ;

                // The _handled method is fired to tell the default movestart
                // handler that one of the move events is bound.
                template._handled = handled;

                // Pass the touchmove event so it can be prevented if or when
                // movestart is handled.
                template._preventTouchmoveDefault = function() {
                        e.preventDefault();
                };

                // Trigger the movestart event.
                trigger(template.target, template);

                // Unbind handlers that tracked the touch or mouse up till now.
                fn(template.identifier);
        }


        // Handlers that control what happens following a movestart

        function activeMousemove(e) {
                var timer = e.data.timer;

                e.data.touch = e;
                e.data.timeStamp = e.timeStamp;
                timer.kick();
        }

        function activeMouseend(e) {
                var event = e.data.event,
                    timer = e.data.timer;

                removeActiveMouse();

                endEvent(event, timer, function() {
                        // Unbind the click suppressor, waiting until after mouseup
                        // has been handled.
                        setTimeout(function(){
                                remove(event.target, 'click', returnFalse);
                        }, 0);
                });
        }

        function removeActiveMouse(event) {
                remove(document, mouseevents.move, activeMousemove);
                remove(document, mouseevents.end, activeMouseend);
        }

        function activeTouchmove(e) {
                var event = e.data.event,
                    timer = e.data.timer,
                    touch = changedTouch(e, event);

                if (!touch) { return; }

                // Stop the interface from gesturing
                e.preventDefault();

                event.targetTouches = e.targetTouches;
                e.data.touch = touch;
                e.data.timeStamp = e.timeStamp;
                timer.kick();
        }

        function activeTouchend(e) {
                var event = e.data.event,
                    timer = e.data.timer,
                    touch = identifiedTouch(e.changedTouches, event.identifier);

                // This isn't the touch you're looking for.
                if (!touch) { return; }

                removeActiveTouch(event);
                endEvent(event, timer);
        }

        function removeActiveTouch(event) {
                remove(document, '.' + event.identifier, activeTouchmove);
                remove(document, '.' + event.identifier, activeTouchend);
        }


        // Logic for triggering move and moveend events

        function updateEvent(event, touch, timeStamp, timer) {
                var time = timeStamp - event.timeStamp;

                event.type = 'move';
                event.distX =  touch.pageX - event.startX;
                event.distY =  touch.pageY - event.startY;
                event.deltaX = touch.pageX - event.pageX;
                event.deltaY = touch.pageY - event.pageY;

                // Average the velocity of the last few events using a decay
                // curve to even out spurious jumps in values.
                event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
                event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
                event.pageX =  touch.pageX;
                event.pageY =  touch.pageY;
        }

        function endEvent(event, timer, fn) {
                timer.end(function(){
                        event.type = 'moveend';

                        trigger(event.target, event);

                        return fn && fn();
                });
        }


        // jQuery special event definition

        function setup(data, namespaces, eventHandle) {
                // Stop the node from being dragged
                //add(this, 'dragstart.move drag.move', preventDefault);

                // Prevent text selection and touch interface scrolling
                //add(this, 'mousedown.move', preventIgnoreTags);

                // Tell movestart default handler that we've handled this
                add(this, 'movestart.move', flagAsHandled);

                // Don't bind to the DOM. For speed.
                return true;
        }

        function teardown(namespaces) {
                remove(this, 'dragstart drag', preventDefault);
                remove(this, 'mousedown touchstart', preventIgnoreTags);
                remove(this, 'movestart', flagAsHandled);

                // Don't bind to the DOM. For speed.
                return true;
        }

        function addMethod(handleObj) {
                // We're not interested in preventing defaults for handlers that
                // come from internal move or moveend bindings
                if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
                        return;
                }

                // Stop the node from being dragged
                add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

                // Prevent text selection and touch interface scrolling
                add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
        }

        function removeMethod(handleObj) {
                if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
                        return;
                }

                remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
                remove(this, 'mousedown.' + handleObj.guid);
        }

        jQuery.event.special.movestart = {
                setup: setup,
                teardown: teardown,
                add: addMethod,
                remove: removeMethod,

                _default: function(e) {
                        var event, data;

                        // If no move events were bound to any ancestors of this
                        // target, high tail it out of here.
                        if (!e._handled()) { return; }

                        function update(time) {
                                updateEvent(event, data.touch, data.timeStamp);
                                trigger(e.target, event);
                        }

                        event = {
                                target: e.target,
                                startX: e.startX,
                                startY: e.startY,
                                pageX: e.pageX,
                                pageY: e.pageY,
                                distX: e.distX,
                                distY: e.distY,
                                deltaX: e.deltaX,
                                deltaY: e.deltaY,
                                velocityX: e.velocityX,
                                velocityY: e.velocityY,
                                timeStamp: e.timeStamp,
                                identifier: e.identifier,
                                targetTouches: e.targetTouches,
                                finger: e.finger
                        };

                        data = {
                                event: event,
                                timer: new Timer(update),
                                touch: undefined,
                                timeStamp: undefined
                        };

                        if (e.identifier === undefined) {
                                // We're dealing with a mouse
                                // Stop clicks from propagating during a move
                                add(e.target, 'click', returnFalse);
                                add(document, mouseevents.move, activeMousemove, data);
                                add(document, mouseevents.end, activeMouseend, data);
                        }
                        else {
                                // We're dealing with a touch. Stop touchmove doing
                                // anything defaulty.
                                e._preventTouchmoveDefault();
                                add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
                                add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
                        }
                }
        };

        jQuery.event.special.move = {
                setup: function() {
                        // Bind a noop to movestart. Why? It's the movestart
                        // setup that decides whether other move events are fired.
                        add(this, 'movestart.move', jQuery.noop);
                },

                teardown: function() {
                        remove(this, 'movestart.move', jQuery.noop);
                }
        };

        jQuery.event.special.moveend = {
                setup: function() {
                        // Bind a noop to movestart. Why? It's the movestart
                        // setup that decides whether other move events are fired.
                        add(this, 'movestart.moveend', jQuery.noop);
                },

                teardown: function() {
                        remove(this, 'movestart.moveend', jQuery.noop);
                }
        };

        add(document, 'mousedown.move', mousedown);
        add(document, 'touchstart.move', touchstart);

        // Make jQuery copy touch event properties over to the jQuery event
        // object, if they are not already listed. But only do the ones we
        // really need. IE7/8 do not have Array#indexOf(), but nor do they
        // have touch events, so let's assume we can ignore them.
        if (typeof Array.prototype.indexOf === 'function') {
                (function(jQuery, undefined){
                        var props = ["changedTouches", "targetTouches"],
                            l = props.length;

                        while (l--) {
                                if (jQuery.event.props.indexOf(props[l]) === -1) {
                                        jQuery.event.props.push(props[l]);
                                }
                        }
                })(jQuery);
        };
  });
})(jQuery);
