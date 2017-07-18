// Copyright 2014-2017, University of Colorado Boulder

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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Input = require( 'SCENERY/input/Input' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Property.<Range>} rangeProperty - If the range is anticipated to change, it's best to have the range
   *                                           property contain the (maximum) union of all potential changes, so that
   *                                           NumberPicker can iterate through all possible values and compute the
   *                                           bounds of the labels.
   * @param {Object} [options]
   * @constructor
   */
  function NumberPicker( valueProperty, rangeProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    // See https://github.com/phetsims/area-model-common/issues/5
    assert && assert( !options.formatText, 'Deprecated, use formatValue instead' );

    options = _.extend( {
      cursor: 'pointer',
      color: new Color( 0, 0, 255 ), // {Color|string|Property.<Color|string>} color of arrows, and top/bottom gradient on pointer over
      backgroundColor: 'white', // {Color|string|Property.<Color|string>} color of the background when pointer is not over it
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      decimalPlaces: 0,
      font: new PhetFont( 24 ),
      upFunction: function( value ) { return value + 1; },
      downFunction: function( value ) { return value - 1; },
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this frequency (milliseconds),
      noValueString: '-', // string to display if valueProperty.get is null or undefined
      align: 'center', // horizontal alignment of the value, 'center'|'right'|'left'
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 5,
      backgroundStroke: 'gray',
      backgroundLineWidth: 0.5,
      arrowHeight: 6,
      arrowYSpacing: 3,
      arrowStroke: 'black',
      arrowLineWidth: 0.25,
      valueMaxWidth: null, // {number|null} - If non-null, it will cap the value's maxWidth to this value

      // a11y
      tagName: 'input',
      inputType: 'number',
      inputValue: valueProperty.get(),

      /**
       * Converts a value to a string to be displayed in a Text node. NOTE: If this function can give different strings
       * to the same value depending on external state, it is recommended to rebuild the NumberPicker when that state
       * changes (as it uses formatValue over the initial range to determine the bounds that labels can take).
       *
       * @param {number} value - the current value
       * @returns {string}
       */
      formatValue: function( value ) {
        return Util.toFixed( value, options.decimalPlaces );
      },

      /**
       * Determines whether the up arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      upEnabledFunction: function( value, range ) {
        return ( value !== null && value !== undefined && value < range.max );
      },

      /**
       * Determines whether the down arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      downEnabledFunction: function( value, range ) {
        return ( value !== null && value !== undefined && value > range.min );
      }
    }, options );

    // {Color|string|Property.<Color|string} color of arrows and top/bottom gradient when pressed
    if ( options.pressedColor === undefined ) {
      if ( options.color instanceof Property ) {
        // @private {Property.<Color>}
        this.pressedColorProperty = new DerivedProperty( [ options.color ], function( color ) {
          return Color.toColor( color ).darkerColor();
        } );
        options.pressedColor = this.pressedColorProperty;
      }
      else {
        options.pressedColor = Color.toColor( options.color ).darkerColor();
      }
    }

    var self = this;
    Node.call( this );

    //------------------------------------------------------------
    // Properties

    this.valueProperty = valueProperty; // @private must be unlinked in dispose

    var upStateProperty = new Property( 'up' ); // up|down|over|out
    var downStateProperty = new Property( 'up' ); // up|down|over|out

    // @private must be detached in dispose
    this.upEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.upEnabledFunction );

    // @private must be detached in dispose
    this.downEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.downEnabledFunction );

    //------------------------------------------------------------
    // Nodes

    // displays the value
    var valueNode = new Text( '', { font: options.font, pickable: false } );

    // compute max width of text based on the width of all possible values.
    // See https://github.com/phetsims/area-model-common/issues/5
    // TODO: Recalculate maximum width on range changes, see https://github.com/phetsims/scenery-phet/issues/306
    var currentSampleValue = rangeProperty.get().min;
    var sampleValues = [];
    while ( currentSampleValue <= rangeProperty.get().max ) {
      sampleValues.push( currentSampleValue );
      currentSampleValue = options.upFunction( currentSampleValue );
      assert && assert( sampleValues.length < 500000, 'Don\'t infinite loop here' );
    }
    var maxWidth = Math.max.apply( null, sampleValues.map( function( value ) {
      valueNode.text = options.formatValue( value );
      return valueNode.width;
    } ) );
    // Cap the maxWidth if valueMaxWidth is provided, see https://github.com/phetsims/scenery-phet/issues/297
    if ( options.valueMaxWidth !== null ) {
      maxWidth = Math.min( maxWidth, options.valueMaxWidth );
    }

    // compute shape of the background behind the numeric value
    var backgroundWidth = maxWidth + ( 2 * options.xMargin );
    var backgroundHeight = valueNode.height + ( 2 * options.yMargin );
    var backgroundOverlap = 1;
    var backgroundCornerRadius = options.cornerRadius;

    // Apply the max-width AFTER computing the backgroundHeight, so it doesn't shrink vertically
    valueNode.maxWidth = maxWidth;

    // top half of the background, for 'up'. Shape computed starting at upper-left, going clockwise.
    var upBackground = new Path( new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close(), { pickable: false } );

    // bottom half of the background, for 'down'. Shape computed starting at bottom-right, going clockwise.
    var downBackground = new Path( new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close(), { pickable: false } );

    // separate rectangle for stroke around value background
    var strokedBackground = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, backgroundCornerRadius, backgroundCornerRadius, {
      pickable: false,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    // compute size of arrows
    var arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    var arrowOptions = {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      pickable: false
    };

    // 'up' arrow
    var upArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, 0 )
      .lineTo( arrowButtonSize.width, arrowButtonSize.height )
      .lineTo( 0, arrowButtonSize.height )
      .close();
    this.upArrow = new Path( upArrowShape, arrowOptions ); // @private
    this.upArrow.centerX = upBackground.centerX;
    this.upArrow.bottom = upBackground.top - options.arrowYSpacing;

    // 'down' arrow
    var downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    this.downArrow = new Path( downArrowShape, arrowOptions ); // @private
    this.downArrow.centerX = downBackground.centerX;
    this.downArrow.top = downBackground.bottom + options.arrowYSpacing;

    // parents for 'up' and 'down' components
    var upParent = new Node( { children: [ upBackground, this.upArrow ] } );
    upParent.addChild( new Rectangle( upParent.localBounds ) ); // invisible overlay
    var downParent = new Node( { children: [ downBackground, this.downArrow ] } );
    downParent.addChild( new Rectangle( downParent.localBounds ) ); // invisible overlay

    // rendering order
    this.addChild( upParent );
    this.addChild( downParent );
    this.addChild( strokedBackground );
    this.addChild( valueNode );

    //------------------------------------------------------------
    // Pointer areas

    // touch area
    upParent.touchArea = Shape.rectangle(
      upParent.left - ( options.touchAreaXDilation / 2 ), upParent.top - options.touchAreaYDilation,
      upParent.width + options.touchAreaXDilation, upParent.height + options.touchAreaYDilation );
    downParent.touchArea = Shape.rectangle(
      downParent.left - ( options.touchAreaXDilation / 2 ), downParent.top,
      downParent.width + options.touchAreaXDilation, downParent.height + options.touchAreaYDilation );

    // mouse area
    upParent.mouseArea = Shape.rectangle(
      upParent.left - ( options.mouseAreaXDilation / 2 ), upParent.top - options.mouseAreaYDilation,
      upParent.width + options.mouseAreaXDilation, upParent.height + options.mouseAreaYDilation );
    downParent.mouseArea = Shape.rectangle(
      downParent.left - ( options.mouseAreaXDilation / 2 ), downParent.top,
      downParent.width + options.mouseAreaXDilation, downParent.height + options.mouseAreaYDilation );

    //------------------------------------------------------------
    // Colors

    // arrow colors
    var arrowColors = {
      up: options.color,
      over: options.color,
      down: options.pressedColor,
      out: options.color,
      disabled: 'rgb(176,176,176)'
    };

    // background colors
    var highlightGradient = createVerticalGradient( options.color, options.backgroundColor, options.color, backgroundHeight );
    var pressedGradient = createVerticalGradient( options.pressedColor, options.backgroundColor, options.pressedColor, backgroundHeight );
    var backgroundColors = {
      up: options.backgroundColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: options.backgroundColor
    };

    //------------------------------------------------------------
    // Observers and InputListeners

    // up
    upParent.addInputListener( new ButtonStateListener( upStateProperty ) );
    this.upListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.min( options.upFunction( valueProperty.get() ), rangeProperty.get().max ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    upParent.addInputListener( this.upListener );

    // down
    downParent.addInputListener( new ButtonStateListener( downStateProperty ) );
    // @private
    this.downListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.max( options.downFunction( valueProperty.get() ), rangeProperty.get().min ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    downParent.addInputListener( this.downListener );

    // enable/disable listeners: unlink unnecessary, properties are owned by this instance
    this.upEnabledProperty.link( function( enabled ) { self.upListener.enabled = enabled; } );
    this.downEnabledProperty.link( function( enabled ) { self.downListener.enabled = enabled; } );

    // @private Update text to match the value
    this.valueObserver = function( value ) {
      if ( value === null || value === undefined ) {
        valueNode.text = options.noValueString;
        valueNode.x = ( backgroundWidth - valueNode.width ) / 2; // horizontally centered
      }
      else {
        valueNode.text = options.formatValue( value );
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
          throw new Error( 'unsupported value for options.align: ' + options.align );
        }
      }
      valueNode.centerY = backgroundHeight / 2;
    };
    this.valueProperty.link( this.valueObserver ); // must be unlinked in dispose

    // @private update colors for 'up' components
    Property.multilink( [ upStateProperty, this.upEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, upBackground, self.upArrow, backgroundColors, arrowColors );
    } );

    // @private update colors for 'down' components
    Property.multilink( [ downStateProperty, this.downEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, downBackground, self.downArrow, backgroundColors, arrowColors );
    } );

    // @private (a11y) - update Property value on input from keyboard or assistive technology
    this.accessibleInputListener = this.addAccessibleInputListener( {
      keydown: function( event ) {

        // prevent user from changing value with number or the space keys
        if ( Input.isNumberKey( event.keyCode ) || event.keyCode === Input.KEY_SPACE ) {
          event.preventDefault();
        }
      },
      input: function( event ) {

        // if input value is empty, inputValue was cleared by the browser after focus, don't update the Property value
        if ( self.inputValue ) {
          if ( self.inputValue > valueProperty.get() && self.upEnabledProperty.get() ) {

            // user intended to increment
            valueProperty.set( Math.min( options.upFunction( valueProperty.get() ), rangeProperty.get().max ) );
          }
          else if ( self.inputValue < valueProperty.get() && self.downEnabledProperty.get() ) {

            // user intended to decrement
            valueProperty.set( Math.max( options.downFunction( valueProperty.get() ), rangeProperty.get().min ) );
          }
        }

        self.inputValue = valueProperty.get();
      }
    } );

    this.mutate( options );

    // a11y - custom focus highlight that matches rounded background behind the numeric value
    var focusBounds = this.localBounds.dilated( 5 );
    this.focusHighlight = Shape.roundedRectangleWithRadii(
      focusBounds.minX,
      focusBounds.minY,
      focusBounds.width,
      focusBounds.height, {
        topLeft: options.cornerRadius,
        topRight: options.cornerRadius,
        bottomLeft: options.cornerRadius,
        bottomRight: options.cornerRadius
      }
    );
  }

  sceneryPhet.register( 'NumberPicker', NumberPicker );

  /**
   * Converts ButtonListener events to state changes.
   *
   * @param {Property.<string>} stateProperty up|down|over|out
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

  sceneryPhet.register( 'NumberPicker.ButtonStateListener', ButtonStateListener );

  inherit( ButtonListener, ButtonStateListener );

  // creates a vertical gradient
  var createVerticalGradient = function( topColor, centerColor, bottomColor, height ) {
    return new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, topColor )
      .addColorStop( 0.5, centerColor )
      .addColorStop( 1, bottomColor );
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

  return inherit( Node, NumberPicker, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      if ( this.pressedColorProperty ) {
        this.pressedColorProperty.dispose();
      }

      this.upEnabledProperty.unlinkAll(); // Property is owned by this instance
      this.upEnabledProperty.dispose();

      this.downEnabledProperty.unlinkAll(); // Property is owned by this instance
      this.downEnabledProperty.dispose();

      this.valueProperty.unlink( this.valueObserver );

      this.removeAccessibleInputListener( this.accessibleInputListener );

      Node.prototype.dispose.call( this );
    },

    // @public
    setArrowsVisible: function( visible ) {
      this.upListener.setEnabled( visible );
      this.downListener.setEnabled( visible );
      this.upArrow.visible = this.downArrow.visible = visible;
    }
  } );
} );
