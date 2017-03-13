// Copyright 2015-2017, University of Colorado Boulder

/**
 * Control for changing a Property of type {number}.
 * Consists of a labeled value, slider and arrow buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var TNumberControl = require( 'SCENERY_PHET/TNumberControl' );

  /**
   * @param {string} title
   * @param {Property.<number>} numberProperty
   * @param {Range} numberRange
   * @param {Object} [options]
   * @constructor
   */
  function NumberControl( title, numberProperty, numberRange, options ) {

    options = _.extend( {

      startCallback: function() {}, // called when interaction begins
      endCallback: function() {}, // called when interaction ends
      enabledProperty: new Property( true ), // {Property.<boolean>} is this control enabled?
      disabledOpacity: 0.5, // {number} opacity used to make the control look disabled

      // title
      titleFont: new PhetFont( 12 ),
      titleMaxWidth: null, // {null|string} maxWidth to use for title, to constrain width for i18n

      // value
      valueFont: new PhetFont( 12 ),
      valueAlign: 'right',
      valueMaxWidth: null, // {null|string} maxWidth to use for value display, to constrain width for i18n
      valueXMargin: 8,
      valueYMargin: 2,
      valueBackgroundStroke: 'lightGray',
      valueBackgroundLineWidth: 1,
      valueBackgroundCornerRadius: 0,
      decimalPlaces: 0,

      // {string} Pattern used to format the value. Must contain '{0}'.
      // If you want units or other verbiage, add them to the pattern, e.g. '{0} L'
      valuePattern: '{0}',

      // arrow buttons
      delta: 1,

      // With the exception of startDrag and endDrag (use startCallback and endCallback respectively),
      // all HSlider options may be used. These are the ones that NumberControl overrides:
      trackSize: new Dimension2( 180, 3 ),
      thumbSize: new Dimension2( 17, 34 ),
      majorTickLength: 20,
      minorTickStroke: 'rgba( 0, 0, 0, 0.3 )',

      // other slider options that are specific to NumberControl
      majorTicks: [], // array of objects with these fields: { value: {number}, label: {Node} }
      minorTickSpacing: 0, // zero indicates no minor ticks

      // A {function} that handles layout of subcomponents.
      // It has signature function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton )
      // and returns a Node. If you want to customize the layout, use one of the predefined creators
      // (see createLayoutFunction*) or create your own function.
      layoutFunction: NumberControl.createLayoutFunction1(),

      // scale factor applied to the arrow buttons
      arrowButtonScale: 0.85,

      // phet-io
      tandem: Tandem.tandemRequired(),
      phetioType: TNumberControl
    }, options );

    // highlight color for thumb defaults to a brighter version of the thumb color
    if ( options.thumbFillEnabled && !options.thumbFillHighlighted ) {
      options.thumbFillHighlighted = Color.toColor( options.thumbFillEnabled ).brighterColor();
    }

    // constrain the slider value to the provided range and the same delta as the arrow buttons
    options.constrainValue = options.constrainValue || function( value ) {
        var newValue = Util.roundSymmetric( value / options.delta ) * options.delta;
        return numberRange.constrainValue( newValue );
      };

    // validate options
    assert && assert( !options.startDrag, 'use options.startCallback instead of options.startDrag' );
    assert && assert( !options.endDrag, 'use options.endCallback instead of options.endDrag' );
    assert && assert( options.disabledOpacity > 0 && options.disabledOpacity < 1, 'invalid disabledOpacity: ' + options.disabledOpacity );

    var self = this;

    var delta = options.delta; // to improve readability

    var titleNode = new Text( title, {
      font: options.titleFont,
      maxWidth: options.titleMaxWidth,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    var numberDisplay = new NumberDisplay( numberProperty, numberRange, {
      valuePattern: options.valuePattern,
      font: options.valueFont,
      align: options.valueAlign,
      decimalPlaces: options.decimalPlaces,
      xMargin: options.valueXMargin,
      yMargin: options.valueYMargin,
      backgroundStroke: options.valueBackgroundStroke,
      backgroundLineWidth: options.valueBackgroundLineWidth,
      cornerRadius: options.valueBackgroundCornerRadius,
      maxWidth: options.valueMaxWidth,
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    var arrowButtonOptions = {
      delta: options.delta,
      startCallback: options.startCallback,
      endCallback: options.endCallback,
      scale: options.arrowButtonScale
    };

    var leftArrowButton = new ArrowButton( 'left', function() {
      var value = numberProperty.get() - delta;
      value = Util.roundSymmetric( value / delta ) * delta; // constrain to delta
      value = Math.max( value, numberRange.min ); // constrain to range
      numberProperty.set( value );
    }, _.extend( {
      tandem: options.tandem.createTandem( 'leftArrowButton' )
    }, arrowButtonOptions ) );

    var rightArrowButton = new ArrowButton( 'right', function() {
      var value = numberProperty.get() + delta;
      value = Util.roundSymmetric( value / delta ) * delta; // constrain to delta
      value = Math.min( value, numberRange.max ); // constrain to range
      numberProperty.set( value );
    }, _.extend( {
      tandem: options.tandem.createTandem( 'rightArrowButton' )
    }, arrowButtonOptions ) );

    var arrowEnabledListener = function( value ) {
      leftArrowButton.enabled = ( value > numberRange.min );
      rightArrowButton.enabled = ( value < numberRange.max );
    };
    numberProperty.link( arrowEnabledListener );

    var slider = new HSlider( numberProperty, numberRange, _.extend(
      // prevent supertype options from being passed, see https://github.com/phetsims/scenery-phet/issues/255
      _.omit( options, Node.prototype._mutatorKeys ),
      {
        // Use these more general callback options, because the same callbacks apply to the arrow buttons,
        // where it makes no sense to call them startDrag and endDrag.
        startDrag: options.startCallback,
        endDrag: options.endCallback,
        tandem: options.tandem.createTandem( 'slider' )
      } ) );

    // major ticks
    var majorTicks = options.majorTicks;
    for ( var i = 0; i < majorTicks.length; i++ ) {
      slider.addMajorTick( majorTicks[ i ].value, majorTicks[ i ].label );
    }

    // minor ticks, exclude values where we already have major ticks
    if ( options.minorTickSpacing > 0 ) {
      for ( var minorTickValue = numberRange.min; minorTickValue <= numberRange.max; ) {
        if ( !_.find( majorTicks, function( majorTick ) { return majorTick.value === minorTickValue; } ) ) {
          slider.addMinorTick( minorTickValue );
        }
        minorTickValue += options.minorTickSpacing;
      }
    }

    options.children = [
      options.layoutFunction( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton )
    ];
    Node.call( this, options );

    // enabled/disable this control
    this.enabledProperty = options.enabledProperty; // @public
    var enabledObserver = function( enabled ) {
      self.pickable = enabled;
      self.opacity = enabled ? 1.0 : options.disabledOpacity;
      //TODO if !enabled, cancel any interaction that is in progress, see scenery#218
    };
    this.enabledProperty.link( enabledObserver );

    // @private
    this.disposeNumberControl = function() {

      numberDisplay.dispose();
      leftArrowButton.dispose();
      rightArrowButton.dispose();
      slider.dispose();

      numberProperty.unlink( arrowEnabledListener );
      self.enabledProperty.unlink( enabledObserver );
    };
  }

  sceneryPhet.register( 'NumberControl', NumberControl );

  return inherit( VBox, NumberControl, {

    // @public
    dispose: function() {
      this.disposeNumberControl();
      VBox.prototype.dispose.call( this );
    },

    // @public
    setEnabled: function( enabled ) { this.enabledProperty.set( enabled ); },
    set enabled( value ) { this.setEnabled( value ); },

    // @public
    getEnabled: function() { return this.enabledProperty.get(); },
    get enabled() { return this.getEnabled(); }

  }, {

    /**
     * Creates a NumberControl with default tick marks for min and max values.
     * @param {string} label
     * @param {Property.<number>} property
     * @param {Range} range
     * @param {Object} [options]
     * @returns {NumberControl}
     * @static
     * @public
     */
    withMinMaxTicks: function( label, property, range, options ) {

      options = _.extend( {
        tickLabelFont: new PhetFont( 12 )
      }, options );

      options.majorTicks = [
        { value: range.min, label: new Text( range.min, { font: options.tickLabelFont } ) },
        { value: range.max, label: new Text( range.max, { font: options.tickLabelFont } ) }
      ];

      return new NumberControl( label, property, range, options );
    },

    /**
     * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
     * Arranges subcomponents like this:
     *
     *  title number
     *  < ------|------ >
     *
     * @param {Object} [options]
     * @returns {function}
     * @public
     * @static
     */
    createLayoutFunction1: function( options ) {

      options = _.extend( {
        align: 'center', // {string} horizontal alignment of rows, 'left'|'right'|'center'
        titleXSpacing: 5, // {number} horizontal spacing between title and number
        arrowButtonsXSpacing: 15, // {number} horizontal spacing between arrow buttons and slider
        ySpacing: 5 // {number} vertical spacing between rows
      }, options );

      return function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        return new VBox( {
          align: options.align,
          spacing: options.ySpacing,
          children: [
            new HBox( {
              spacing: options.titleXSpacing,
              children: [ titleNode, numberDisplay ]
            } ),
            new HBox( {
              spacing: options.arrowButtonsXSpacing,
              resize: false, // prevent slider from causing a resize when thumb is at min or max
              children: [ leftArrowButton, slider, rightArrowButton ]
            } )
          ]
        } );
      };
    },

    /**
     * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
     * Arranges subcomponents like this:
     *
     *  title < number >
     *  ------|------
     *
     * @param {Object} [options]
     * @returns {function}
     * @public
     * @static
     */
    createLayoutFunction2: function( options ) {

      options = _.extend( {
        align: 'center', // {string} horizontal alignment of rows, 'left'|'right'|'center'
        xSpacing: 5, // {number} horizontal spacing in top row
        ySpacing: 5 // {number} vertical spacing between rows
      }, options );

      return function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        return new VBox( {
          align: options.align,
          spacing: options.ySpacing,
          resize: false, // prevent slider from causing a resize when thumb is at min or max
          children: [
            new HBox( {
              spacing: options.xSpacing,
              children: [ titleNode, leftArrowButton, numberDisplay, rightArrowButton ]
            } ),
            slider
          ]
        } );
      };
    },

    /**
     * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
     * Arranges subcomponents like this:
     *
     *  title
     *  < number >
     *  -------|-------
     *
     * @param {Object} [options]
     * @returns {function}
     * @public
     * @static
     */
    createLayoutFunction3: function( options ) {

      options = _.extend( {
        alignTitle: 'center', // {string} horizontal alignment of title, relative to slider, 'left'|'right'|'center'
        alignNumber: 'center', // {string} horizontal alignment of number display, relative to slider, 'left'|'right'|'center'
        xSpacing: 5, // {number} horizontal spacing between arrow buttons and slider
        ySpacing: 5 // {number} vertical spacing between rows
      }, options );

      return function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        return new VBox( {
          spacing: options.ySpacing,
          resize: false, // prevent slider from causing a resize when thumb is at min or max
          align: options.alignTitle,
          children: [
            titleNode,
            new VBox( {
              spacing: options.ySpacing,
              resize: false, // prevent slider from causing a resize when thumb is at min or max
              align: options.alignNumber,
              children: [
                new HBox( {
                  spacing: options.xSpacing,
                  children: [ leftArrowButton, numberDisplay, rightArrowButton ]
                } ),
                slider
              ]
            } )
          ]
        } );
      };
    }
  } );
} );
