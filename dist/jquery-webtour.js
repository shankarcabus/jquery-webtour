/*! jQuery Webtour - v0.1.0 - 2013-07-29
* https://github.com/Helielson/jquery-webtour
* Copyright (c) 2013 Helielson; Licensed MIT */
;(function ( $, window, document, undefined ) {

/**
  * Creates a step of tour with text, arrow and element. The position of the
  * text is based on the arrow position, and the arrow position is based on the
  * element position.
  *
  * The place that text and arrow should be displayed is based on spots of the
  * element and of the target.
  *
  * Spots:
  *
  *   TL     T     TR
  *    *-----*-----*
  *    |           |
  *    |           |
  *  L *           * R
  *    |           |
  *    |           |
  *    *-----*-----*
  *   BL     B     BR
  *
  **/

  var pluginName = "tour",
    defaults = {
      'text'          : 'Lorem Ipsum', // Text of tour
      'arrowImage'    : '', // Image of arrow
      'arrowOrigin'   : 'T', // Spot of the arrow origin
      'arrowTarget'   : 'B', // Spot of the arrow target
      'arrowPadding'  :  0, // Padding to arrow
      'textOrigin'    : 'T', // Spot of the text
      'textTarget'    : 'BL', // Spot of the text target
      'textWidth'     : 200, // Width of the text
      'textPadding'   : 0, // Text Padding
      'padding'       : 0,  // Padding of element
      'button'        : {
        'clss'   : 'btn btn-primary', // Button class
        'text'    : 'Ok, got it' // Button text
      },
      'callback'      : function(){}, // Callback of button
      'lock'          : true // Lock element actions
    };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }


  Plugin.prototype = {
    init : function() {
      if (this.element.length <= 0) {
        return false;
      }

      var _this = this;

      var $body = $('body'),
          stepIndex = $body.data('stepIndex') === undefined ? 0 : $body.data('stepIndex'),
          $stepTour = $('<div/>').addClass('tour step'+stepIndex);

      // TEXT
      var $text = $('<div/>').html('<p>'+this.options.text+'</p>')
        .width(this.options.textWidth)
        .addClass('tour-text')
        .css('padding',this.options.textPadding);

      // NEXT BUTTON
      var $button = $('<button/>').addClass(_this.options.button.clss)
      .html(_this.options.button.text)
      .on('click', function(){ // Button actions
        var $next = $('.tour.step'+(stepIndex+1));

        if($next.length > 0) { // Show the next step
          $next.hide().css('visibility','visible').fadeIn();
        } else { // Adds again the scrollbar
          $body.css({'overflow':'initial'});
        }

        // Hide this step
        $('.tour.step'+stepIndex).fadeOut();

        _this.options.callback(); // Executes call back button
      });
      $text.append($button);

      // Positions the arrow and the text when the image is loaded
      var $arrow = $('<img/>').load(function(){
        // Get arrow target coordinate (e.g {'x':0, 'y':0})
        var arrowTarget = _this.getCoordinate(_this.element, _this.options.arrowTarget);
        // Get arrow position (e.g {'left':0, 'top':0})
        var arrowPosition = _this.getPosition($arrow, _this.options.arrowOrigin, arrowTarget);
        $arrow.css(arrowPosition);

        // Get text target coordinate (e.g {'x':0, 'y':0})
        var textTarget = _this.getCoordinate($arrow, _this.options.textTarget);
        // Get text position (e.g {'left':0, 'top':0})
        var textPosition = _this.getPosition($text, _this.options.textOrigin, textTarget);
        $text.css(textPosition);

      }).attr({src: this.options.arrowImage})
        .addClass('tour-arrow')
        .css('padding',this.options.arrowPadding);

      // Adds a div between the page elements and the tour elements.
      if (this.options.lock) {
        $stepTour.append(
          $('<div/>').css({
            'z-index'   : 100001,
            'position'  : 'absolute',
            'width'     : '100%',
            'height'    : '100%',
            'top'       : 0,
            'left'      : 0
          })
        );
      }

      // Adds text and arrow
      $stepTour.append($arrow)
        .append($text);

      // Adds mask
      this.makeMask($stepTour);

      // Show only the first step
      if (stepIndex === 0) {
        $stepTour.css('visibility','visible');
      } else {
        $stepTour.css('visibility','hidden');
      }

      // Append the step
      $body.append($stepTour)
        .css({'overflow':'hidden'})
        .data('stepIndex',stepIndex+1);
    },

    makeMask: function($stepTour) {
      /*

      The mask is formed by 4 rectangles around the element. When:

      A = Top mask
      B = Right mask
      C = Bottom mask
      D = Left mask
       _______________________
      |*****|***********|*****|
      |*****|*****A*****|*****|
      |*****|***********|*****|
      |*****|‾‾‾‾‾‾‾‾‾‾‾|*****|
      |*****|           |*****|
      |**D**|  ELEMENT  |**B**|
      |*****|           |*****|
      |*****|___________|*****|
      |*****|***********|*****|
      |*****|*****C*****|*****|
      |*****|***********|*****|
       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

      The ABCD square with padding = EFGH

      E__________F
      | A______B |
      | |      | |
      | |      | |
      | |______| |
      | D      C |
      H‾‾‾‾‾‾‾‾‾‾G

      E = (A.left - padding, A.top - padding)
      F = (B.left + padding, B.top - padding)
      G = (C.left + C.width + padding, C.top + C.height + padding)
      H = (D.left - paddig, D.top + D.height + padding)

      */

      var $mask = $('<div/>').addClass('mask'),
          $maskTop = $mask.clone(),
          $maskRight = $mask.clone(),
          $maskBottom = $mask.clone(),
          $maskLeft = $mask.clone(),
          padding = this.options.padding,
          _this = this,
          $body = $('body');

      //TOP MASK
      function top() {
        $maskTop.css(
          {
            'top' : 0,
            'left' : _this.element.offset().left - padding,
            'width' : _this.element.outerWidth() + padding*2,
            'height' : _this.element.offset().top - padding
          }
        );
      }

      //RIGHT MASK
      function right() {
        $maskRight.css(
          {
            'top' : 0,
            'right' : 0,
            'width' : $body.outerWidth() - _this.element.offset().left - _this.element.outerWidth() - padding,
            'height' : '100%'
          }
        );
      }

      //BOTTOM MASK
      function bottom() {
        $maskBottom.css(
          {
            'bottom' : 0,
            'left' : _this.element.offset().left - padding,
            'width' : _this.element.outerWidth() + padding*2,
            'height' : $body.outerHeight() - _this.element.offset().top - _this.element.outerHeight() - padding
          }
        );
      }

      //LEFT MASK
      function left() {
        $maskLeft.css(
          {
            'top' : 0,
            'left' : 0,
            'width' : _this.element.offset().left - padding,
            'height' : '100%'
          }
        );
      }

      function positionMask() {
        top();
        left();
        right();
        bottom();
      }

      $(window).resize(function() {
        positionMask();
      });

      positionMask();

      $stepTour.append($maskTop)
        .append($maskRight)
        .append($maskBottom)
        .append($maskLeft);

    },

    getCoordinate: function($el, spot) {
      /**
        Returns the coordinate (x,y) of element spot:

        TL
         |‾‾‾‾‾‾‾|
         |   A   |
         |_______|

         A.TL = (x,y)

         @param $el: element to calculate coordinate
         @param spot: spot of element (TL, T, TR, R, BR, B, BL...)
         @param padding: padding added to coordinate

         |‾‾‾‾‾|
         | B|‾‾|‾‾|
         |__|__|A |
            |_____|
                   BR

         A = $el
         B = A with padding
      */

      var coord = {'x':0, 'y':0},
          top = $el.offset().top,
          middle = top + $el.outerHeight()/2,
          bottom = top + $el.outerHeight(),
          left = $el.offset().left,
          center = left + $el.outerWidth()/2,
          right = left + $el.outerWidth();

      if (spot.indexOf('T') >= 0) {
        coord.y = top;
      }
      else if (spot.indexOf('B') >= 0 ) {
        coord.y = bottom;
      }
      else {
        coord.y = middle;
      }

      if (spot.indexOf('L') >= 0 ) {
        coord.x = left;
      }
      else if (spot.indexOf('R') >= 0 ) {
        coord.x = right;
      }
      else {
        coord.x = center;
      }

      return coord;
    },

    getPosition: function($el, spot, target) {
      /**
        Returns the position (top, left) of an element based on spot and target (x,y).

        Example:
                  ______
        C_______ |      |
        |       ||      |
        |       AB______|
        |_______|

        A -> spot (R)
        B -> target (x,y)
        C -> position (top, left)

      */

      var position = {'left':0, 'top':0},
          width = $el.outerWidth(),
          height = $el.outerHeight();

      if (spot.indexOf('T') >= 0 ) {
        position.top = target.y;
      }
      else if (spot.indexOf('B') >= 0 ) {
        position.top = target.y - height;
      }
      else {
        position.top = target.y - height/2;
      }

      if (spot.indexOf('L') >= 0 ) {
        position.left = target.x;
      }
      else if (spot.indexOf('R') >= 0 ) {
        position.left = target.x - width ;
      }
      else {
        position.left = target.x - width/2;
      }

      return position;
    }
  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
      }
    });
  };

})( jQuery, window, document );
