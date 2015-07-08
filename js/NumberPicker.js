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
  var FireOnHoldInputListener = require( 'SCENERY_PHET/buttons/FireOnHoldInputListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Property.<Range>} rangeProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberPicker( valueProperty, rangeProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      color: new Color( 0, 0, 255 ), // {Color|string}
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      decimalPlaces: 0,
      font: new PhetFont( 24 ),
      upFunction: function() { return valueProperty.get() + 1; },
      downFunction: function() { return valueProperty.get() - 1; },
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this frequency (milliseconds),
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
    options.activatedColor = options.activatedColor || Color.toColor( options.color ).darkerColor();

    var thisNode = this;
    Node.call( thisNode );

    // @private must be detached in dispose
    thisNode.upEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], function( value, range ) {
      return ( value !== null && value !== undefined && value < range.max );
    } );

    // @private must be detached in dispose
    thisNode.downEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], function( value, range ) {
      return ( value !== null && value !== undefined && value > range.min );
    } );

    // up listener
    var upListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.min( options.upFunction(), rangeProperty.get().max ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );

    // down listener
    var downListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.max( options.downFunction(), rangeProperty.get().min ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );

    // enable/disable listeners: unlink unnecessary, properties are owned by this instance
    thisNode.upEnabledProperty.link( function( enabled ) { upListener.enabled = enabled; } );
    thisNode.downEnabledProperty.link( function( enabled ) { downListener.enabled = enabled; } );

    // displays the value
    var valueNode = new Text( '', { font: options.font, pickable: false } );

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

    // top half of the background, for 'up'. Shape computed starting at upper-left, going clockwise.
    var upBackground = new Path( new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close() );
    upBackground.addInputListener( upListener );
    var upStateProperty = new Property( 'up' ); // up|down|over|out
    upBackground.addInputListener( new ButtonStateListener( upStateProperty ) );

    // bottom half of the background, for 'down'. Shape computed starting at bottom-right, going clockwise.
    var downStateProperty = new Property( 'up' ); // up|down|over|out
    var downBackground = new Path( new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close() );
    downBackground.addInputListener( downListener );
    downBackground.addInputListener( new ButtonStateListener( downStateProperty ) );

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
    var arrowColors = {
      up: options.color,
      over: options.color,
      down: options.activatedColor,
      out: options.color,
      disabled: 'rgb(176,176,176)'
    };
    var centerColor = 'white';
    var highlightGradient = createBackgroundGradient( options.color, centerColor, backgroundHeight );
    var pressedGradient = createBackgroundGradient( options.activatedColor, centerColor, backgroundHeight );
    var backgroundColors = {
      up: centerColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: centerColor
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
    this.upArrow = new Path( upArrowShape, arrowOptions ); // @private
    this.upArrow.addInputListener( upListener );

    // 'down' arrow
    var downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    this.downArrow = new Path( downArrowShape, arrowOptions ); // @private
    this.downArrow.addInputListener( downListener );

    // rendering order
    thisNode.addChild( upBackground );
    thisNode.addChild( downBackground );
    thisNode.addChild( strokedBackground );
    thisNode.addChild( this.upArrow );
    thisNode.addChild( this.downArrow );
    thisNode.addChild( valueNode );

    // layout, background nodes are already drawn in the local coordinate frame
    var ySpacing = 3;
    valueNode.x = 0;
    valueNode.centerY = backgroundHeight / 2;
    this.upArrow.centerX = upBackground.centerX;
    this.upArrow.bottom = upBackground.top - ySpacing;
    this.downArrow.centerX = downBackground.centerX;
    this.downArrow.top = downBackground.bottom + ySpacing;

    // @private Update text to match the value
    thisNode.valueObserver = function( value ) {
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
    };
    thisNode.valueProperty = valueProperty; // @private
    thisNode.valueProperty.link( thisNode.valueObserver ); // must be unlinked in dispose

    // @private update colors for 'up' components
    Property.multilink( [ upStateProperty, thisNode.upEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, upBackground, thisNode.upArrow, backgroundColors, arrowColors );
    } );

    // @private update colors for 'down' components
    Property.multilink( [ downStateProperty, thisNode.downEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, downBackground, thisNode.downArrow, backgroundColors, arrowColors );
    } );

    thisNode.mutate( options );
  }

  // creates a vertical gradient where with color1 at the top and bottom, color2 in the center
  var createBackgroundGradient = function( color1, color2, height ) {
    return new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, color1 )
      .addColorStop( 0.5, color2 )
      .addColorStop( 1, color1 );
  };

  // Update arrow and background colors
  var updateColors = function( state, enabled, background, arrow, backgroundColors, arrowColors ) {
    if ( enabled ) {
      arrow.stroke = 'black';
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

  /**
   * Converts ButtonListener events to state changes.
   *
   * @param {Property.<string>} stateProperty up|down|over|out
   * @param {Object} [options]
   * @constructor
   */
  function ButtonStateListener( stateProperty ) {
    ButtonListener.call( this, {
      up: function() { stateProperty.set( 'up' ); },
      over: function() { stateProperty.set( 'over' ); },
      down: function() { stateProperty.set( 'down' ); },
      out: function() { stateProperty.set( 'out' ); }
    } );
  }

  inherit( ButtonListener, ButtonStateListener );

  return inherit( Node, NumberPicker, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.upEnabledProperty.dispose();
      this.downEnabledProperty.dispose();
      this.valueProperty.unlink( this.valueObserver );
    },

    setArrowsVisible: function( visible ) {
      this.upArrow.visible = this.downArrow.visible = visible;
    }
  } );
} );
