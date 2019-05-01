// Copyright 2015-2019, University of Colorado Boulder

/**
 * Front of the HeaterCoolerNode.  It is independent from the HeaterCoolerBack so that one can easily layer objects
 * inside of the HeaterCoolerNode.  The HeaterCoolerFront contains the heater body, labels, and control slider.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 *
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VSlider = require( 'SUN/VSlider' );

  // strings
  const coolString = require( 'string!SCENERY_PHET/cool' );
  const heatString = require( 'string!SCENERY_PHET/heat' );

  // constants
  const DEFAULT_WIDTH = 120; // in screen coords, much of the rest of the size of the stove derives from this value
  const DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

  class HeaterCoolerFront extends Node {

    /**
     * @param {NumberProperty} heatCoolAmountProperty // +1 for max heating, -1 for max cooling
     * @param {Object} [options]
     * @constructor
     */
    constructor( heatCoolAmountProperty, options ) {
      super();

      Tandem.indicateUninstrumentedCode();

      options = _.extend( {
        baseColor: DEFAULT_BASE_COLOR, // {Color|string} Base color used for the stove body.
        width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
        snapToZero: true, // controls whether the slider will snap to the off.
        heatEnabled: true, // Allows slider to reach positive values (corresponding to heating)
        coolEnabled: true, // Allows slider to reach negative values (corresponding to cooling)

        // slider label options
        heatString: heatString, // {string} label for +1 end of slider
        coolString: coolString, // {string} label for -1 end of slider
        labelFont: new PhetFont( 14 ), // {Font}
        labelMaxWidth: 35, // {number} maxWidth of the Heat and Cool labels, determined empirically

        // slider options
        thumbSize: new Dimension2( 22, 45 ), // {Dimension2}
        thumbTouchAreaXDilation: 11, // {number}
        thumbTouchAreaYDilation: 11, // {number}
        thumbMouseAreaXDilation: 0, // {number}
        thumbMouseAreaYDilation: 0, // {number}
        thumbFill: '#71edff', // {Color|string|null}
        thumbFillHighlighted: '#bff7ff' // {Color|string|null}
      }, options );

      assert && assert( options.heatEnabled || options.coolEnabled, 'Either heat or cool must be enabled.' );

      // Dimensions for the rest of the stove, dependent on the specified stove width.  Empirically determined, and could
      // be made into options if needed.
      const height = DEFAULT_WIDTH * 0.75;
      const burnerOpeningHeight = DEFAULT_WIDTH * HeaterCoolerBack.OPENING_HEIGHT_SCALE;
      const bottomWidth = DEFAULT_WIDTH * 0.80;

      // Create the body of the stove.
      const stoveBodyShape = new Shape()
        .ellipticalArc( DEFAULT_WIDTH / 2, burnerOpeningHeight / 4, DEFAULT_WIDTH / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false )
        .lineTo( ( DEFAULT_WIDTH - bottomWidth ) / 2, height + burnerOpeningHeight / 2 )
        .ellipticalArc( DEFAULT_WIDTH / 2, height + burnerOpeningHeight / 4, bottomWidth / 2, burnerOpeningHeight,
          0, Math.PI, 0, true ).lineTo( DEFAULT_WIDTH, burnerOpeningHeight / 2 );

      const stoveBody = new Path( stoveBodyShape, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
          .addColorStop( 0, Color.toColor( options.baseColor ).brighterColor( 0.5 ) )
          .addColorStop( 1, Color.toColor( options.baseColor ).darkerColor( 0.5 ) )
      } );

      // Create the slider.
      // @public (read-only) With this visibility annotation comes great power - use it wisely.
      // See https://github.com/phetsims/scenery-phet/issues/442
      this.slider = new VSlider( heatCoolAmountProperty,
        new Range( options.coolEnabled ? -1 : 0, options.heatEnabled ? 1 : 0 ), {
          trackSize: new Dimension2( DEFAULT_WIDTH / 2, 10 ),
          trackFillEnabled: new LinearGradient( 0, 0, DEFAULT_WIDTH / 2, 0 )
            .addColorStop( 0, '#0A00F0' )
            .addColorStop( 1, '#EF000F' ),
          thumbSize: options.thumbSize,
          thumbLineWidth: 1.4,
          thumbTouchAreaXDilation: options.thumbTouchAreaXDilation,
          thumbTouchAreaYDilation: options.thumbTouchAreaYDilation,
          thumbMouseAreaXDilation: options.thumbMouseAreaXDilation,
          thumbMouseAreaYDilation: options.thumbMouseAreaYDilation,
          thumbFill: options.thumbFill,
          thumbFillHighlighted: options.thumbFillHighlighted,
          thumbCenterLineStroke: 'black',
          majorTickLength: 15,
          minorTickLength: 12,
          centerY: stoveBody.centerY,
          right: stoveBody.right - DEFAULT_WIDTH / 8,
          endDrag: () => {
            if ( options.snapToZero ) {
              heatCoolAmountProperty.set( 0 );
            }
          }
        } );

      // Create the tick labels.
      const labelOptions = {
        font: options.labelFont,
        maxWidth: options.labelMaxWidth
      };
      if ( options.heatEnabled ) { this.slider.addMajorTick( 1, new Text( options.heatString, labelOptions ) ); }
      this.slider.addMinorTick( 0 );
      if ( options.coolEnabled ) { this.slider.addMajorTick( -1, new Text( options.coolString, labelOptions ) ); }

      this.addChild( stoveBody );
      this.addChild( this.slider );

      this.mutate( options );
    }
  }

  return sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );
} );
