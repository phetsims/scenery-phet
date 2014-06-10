// Copyright 2002-2013, University of Colorado Boulder

/**
 * User-interface component for picking a number value from a range.
 * This is essentially a value with integrated up/down spinners.
 * But PhET has been calling it a 'picker', so that's what this type is named.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Timer = require( 'JOIST/Timer' );
  var Util = require( 'DOT/Util' );

  // creates a vertical gradient where with color1 at the top and bottom, color2 in the center
  var createBackgroundGradient = function( color1, color2, height ) {
    return new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, color1 )
      .addColorStop( 0.5, color2 )
      .addColorStop( 1, color1 );
  };

  //-------------------------------------------------------------------------------------------

  /**
   * @param {Property<String>} stateProperty 'up'|'over'|'down'|'out'
   * @param {Property<Boolean>} enabledProperty
   * @param {Function} fireFunction
   * @param {Number} timerDelay start to fire continuously after pressing for this long (milliseconds)
   * @param {Number} intervalDelay // fire continuously at this frequency (milliseconds)
   * @constructor
   */
  function PickerListener( stateProperty, enabledProperty, fireFunction, timerDelay, intervalDelay ) {

    // stuff related to press-&-hold feature
    var fired = false;
    var timeoutID = null;
    var intervalID = null;
    var cleanupTimer = function() {
      if ( timeoutID ) {
        Timer.clearTimeout( timeoutID );
        timeoutID = null;
      }
      if ( intervalID ) {
        Timer.clearInterval( intervalID );
        intervalID = null;
      }
    };

    ButtonListener.call( this, {

      up: function() {
        stateProperty.set( 'up' );
        cleanupTimer();
      },

      over: function() {
        stateProperty.set( 'over' );
      },

      down: function() {
        if ( intervalID === null ) {
          stateProperty.set( 'down' );
          fired = false;
          timeoutID = Timer.setTimeout( function() {
            timeoutID = null;
            fired = true;
            intervalID = Timer.setInterval( function() {
              if ( enabledProperty.get() ) {
                fireFunction();
              }
            }, intervalDelay );
          }, timerDelay );
        }
      },

      out: function() {
        stateProperty.set( 'out' );
      },

      fire: function() {
        cleanupTimer();
        if ( !fired && enabledProperty.get() ) {
          fireFunction();
        }
      }
    } );
  }

  inherit( ButtonListener, PickerListener );

  //-------------------------------------------------------------------------------------------

  /**
   * @param {Property<Number>} valueProperty
   * @param {Property<Range>} rangeProperty
   * @param {*} options
   * @constructor
   */
  function NumberPicker( valueProperty, rangeProperty, options ) {

    options = _.extend( {
      color: new Color( 0, 0, 255 ), // {Color|String}
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      decimalPlaces: 0,
      font: new PhetFont( 24 ),
      upFunction: function() { return valueProperty.get() + 1; },
      downFunction: function() { return valueProperty.get() - 1; },
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      intervalDelay: 100, // fire continuously at this frequency (milliseconds),
      noValueString: '-', // string to display if valueProperty.get is null or undefined
      align: 'center', // horizontal alignment of the value, 'center'|'right'|'left'
      touchAreaExpandX: 10,
      touchAreaExpandY: 20,
      mouseAreaExpandX: 0,
      mouseAreaExpandY: 14,
      backgroundStroke: 'gray',
      backgroundLineWidth: 0.5,
      arrowHeight: 6
    }, options );

    var thisNode = this;
    Node.call( thisNode, { cursor: 'pointer' } );

    // properties for the "up" (increment) control
    var upStateProperty = new Property( 'up' );
    var upEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], function( value, range ) {
      return ( value !== null && value !== undefined && value < range.max );
    } );

    // properties for the "down" (decrement) control
    var downStateProperty = new Property( 'up' );
    var downEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], function( value, range ) {
      return ( value !== null && value !== undefined && value > range.min );
    } );

    // callbacks for changing the value
    var fireUp = function() {
      valueProperty.set( Math.min( options.upFunction(), rangeProperty.get().max ) );
    };
    var fireDown = function() {
      valueProperty.set( Math.max( options.downFunction(), rangeProperty.get().min ) );
    };

    // displays the value
    var valueNode = new Text( "", { font: options.font, pickable: false } );

    // compute max width of text based on value range
    valueNode.text = Util.toFixed( rangeProperty.get().min, options.decimalPlaces );
    var maxWidth = valueNode.width;
    valueNode.text = Util.toFixed( rangeProperty.get().max, options.decimalPlaces );
    maxWidth = Math.max( maxWidth, valueNode.width );

    // compute shape of the background behind the numeric value
    var backgroundWidth = maxWidth + ( 2 * options.xMargin );
    var backgroundHeight = valueNode.height + ( 2 * options.yMargin );
    var backgroundOverlap = 1;
    var backgroundCornerRadius = options.cornerRadius;

    // top half of the background, for "up". Shape computed starting at upper-left, going clockwise.
    var upBackground = new Path( new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close() );
    upBackground.addInputListener( new PickerListener( upStateProperty, upEnabledProperty, fireUp, options.timerDelay, options.intervalDelay ) );

    // bottom half of the background, for "down". Shape computed starting at bottom-right, going clockwise.
    var downBackground = new Path( new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close() );
    downBackground.addInputListener( new PickerListener( downStateProperty, downEnabledProperty, fireDown, options.timerDelay, options.intervalDelay ) );

    // separate rectangle for stroke around value background
    var strokedBackground = new Path( new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .close(), { pickable: false, stroke: options.backgroundStroke, lineWidth: options.backgroundLineWidth } );

    // touch area for buttons
    upBackground.touchArea = Shape.rectangle(
      upBackground.left - ( options.touchAreaExpandX / 2 ), upBackground.top - options.touchAreaExpandY,
      upBackground.width + options.touchAreaExpandX, upBackground.height + options.touchAreaExpandY );
    downBackground.touchArea = Shape.rectangle(
      downBackground.left - ( options.touchAreaExpandX / 2 ), downBackground.top,
      downBackground.width + options.touchAreaExpandX, downBackground.height + options.touchAreaExpandY );

    // mouse area for buttons
    upBackground.mouseArea = Shape.rectangle(
      upBackground.left - ( options.mouseAreaExpandX / 2 ), upBackground.top - options.mouseAreaExpandY,
      upBackground.width + options.mouseAreaExpandX, upBackground.height + options.mouseAreaExpandY );
    downBackground.mouseArea = Shape.rectangle(
      downBackground.left - ( options.mouseAreaExpandX / 2 ), downBackground.top,
      downBackground.width + options.mouseAreaExpandX, downBackground.height + options.mouseAreaExpandY );

    // compute colors
    var baseColor = Color.toColor( options.color );
    var arrowColors = {
      up: baseColor,
      over: baseColor,
      down: baseColor.darkerColor(),
      out: baseColor,
      disabled: 'rgb(176,176,176)'
    };
    var centerColor = 'white';
    var highlightGradient = createBackgroundGradient( baseColor, centerColor, backgroundHeight );
    var pressedGradient = createBackgroundGradient( baseColor.darkerColor(), centerColor, backgroundHeight );
    var backgroundColors = {
      up: 'white',
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: 'white'
    };

    // compute size of arrows
    var arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    // 'up' arrow
    var arrowOptions = { fill: 'white', stroke: 'black', lineWidth: 0.25 };
    var upArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, 0 )
      .lineTo( arrowButtonSize.width, arrowButtonSize.height )
      .lineTo( 0, arrowButtonSize.height )
      .close();
    var upArrow = new Path( upArrowShape, arrowOptions );
    upArrow.addInputListener( new PickerListener( upStateProperty, upEnabledProperty, fireUp, options.timerDelay, options.intervalDelay ) );

    // 'down' arrow
    var downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    var downArrow = new Path( downArrowShape, arrowOptions );
    downArrow.addInputListener( new PickerListener( downStateProperty, downEnabledProperty, fireDown, options.timerDelay, options.intervalDelay ) );

    // rendering order
    thisNode.addChild( upBackground );
    thisNode.addChild( downBackground );
    thisNode.addChild( strokedBackground );
    thisNode.addChild( upArrow );
    thisNode.addChild( downArrow );
    thisNode.addChild( valueNode );

    // layout, background nodes are already drawn in the local coordinate frame
    var ySpacing = 3;
    valueNode.x = 0;
    valueNode.centerY = backgroundHeight / 2;
    upArrow.centerX = upBackground.centerX;
    upArrow.bottom = upBackground.top - ySpacing;
    downArrow.centerX = downBackground.centerX;
    downArrow.top = downBackground.bottom + ySpacing;

    // Update text to match the value
    valueProperty.link( function( value ) {
      if ( value === null || value === undefined ) {
        valueNode.text = options.noValueString;
        valueNode.x = ( backgroundWidth - valueNode.width ) / 2; // horizontally centered
      }
      else {
        valueNode.text = Util.toFixed( value, options.decimalPlaces );
        if ( options.align === 'center' ) {
          valueNode.centerX = upBackground.centerX;
        }
        else if ( options.align === 'right' ) {
          valueNode.right = upBackground.right - options.xMargin;
        }
        else if ( options.align === 'left' ) {
          valueNode.left = upBackground.left + options.xMargin;
        }
        else {
          throw new Error( 'unsupported value for option.align: ' + options.align );
        }
      }
    } );

    // Update button colors
    var updateColors = function( stateProperty, enabledProperty, background, arrow ) {
      if ( enabledProperty.get() ) {
        arrow.stroke = 'black';
        var state = stateProperty.get();
        if ( state === 'up' ) {
          background.fill = backgroundColors.up;
          arrow.fill = arrowColors.up;
        }
        else if ( state === 'over' ) {
          background.fill = backgroundColors.over;
          arrow.fill = arrowColors.over;
        }
        else if ( state === 'down' ) {
          background.fill = backgroundColors.down;
          arrow.fill = arrowColors.down;
        }
        else if ( state === 'out' ) {
          background.fill = backgroundColors.out;
          arrow.fill = arrowColors.out;
        }
        else {
          throw new Error( 'unsupported state: ' + state );
        }
      }
      else {
        background.fill = backgroundColors.disabled;
        arrow.fill = arrowColors.disabled;
        arrow.stroke = arrowColors.disabled; // stroke so that arrow size will look the same when it's enabled/disabled
      }
    };
    var updateUpColors = function() {
      updateColors( upStateProperty, upEnabledProperty, upBackground, upArrow );
    };
    var updateDownColors = function() {
      updateColors( downStateProperty, downEnabledProperty, downBackground, downArrow );
    };
    upStateProperty.link( updateUpColors.bind( thisNode ) );
    upEnabledProperty.link( updateUpColors.bind( thisNode ) );
    downStateProperty.link( updateDownColors.bind( thisNode ) );
    downEnabledProperty.link( updateDownColors.bind( thisNode ) );

    thisNode.mutate( options );
  }

  return inherit( Node, NumberPicker );
} );
