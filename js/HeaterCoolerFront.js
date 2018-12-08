// Copyright 2015-2018, University of Colorado Boulder

/**
 * Front of the HeaterCoolerNode.  It is independent from the HeaterCoolerBack so that one can easily layer objects
 * inside of the HeaterCoolerNode.  The HeaterCoolerFront contains the heater body, labels, and control slider.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
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

  class HeaterCoolerFront extends Node {
    /**
     *
     * @param {NumberProperty} [heatCoolAmountProperty] // +1 for max heating, -1 for max cooling
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    constructor( heatCoolAmountProperty, options ) {
      super();
      Tandem.indicateUninstrumentedCode();
      options = _.extend( {
        baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
        width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
        snapToZero: true, // controls whether the slider will snap to the off.
        heatEnabled: true, // Can this node heat the environment?
        coolEnabled: true, // Can this node cool the environment?

        // slider label options
        labelFont: new PhetFont( 14 ),
        labelMaxWidth: null,

        // slider options
        thumbSize: new Dimension2( 22, 45 ),
        thumbTouchAreaXDilation: 11,
        thumbTouchAreaYDilation: 11,
        thumbMouseAreaXDilation: 0,
        thumbMouseAreaYDilation: 0
      }, options );

      // Dimensions for the rest of the stove, dependent on the specified stove width.  Empirically determined, and could
      // be made into options if needed.
      let height = DEFAULT_WIDTH * 0.75;
      let burnerOpeningHeight = DEFAULT_WIDTH * HeaterCoolerBack.OPENING_HEIGHT_SCALE;
      let bottomWidth = DEFAULT_WIDTH * 0.80;

      // Create the body of the stove.
      let stoveBodyShape = new Shape()
        .ellipticalArc( DEFAULT_WIDTH / 2, burnerOpeningHeight / 4, DEFAULT_WIDTH / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false )
        .lineTo( ( DEFAULT_WIDTH - bottomWidth ) / 2, height + burnerOpeningHeight / 2 )
        .ellipticalArc( DEFAULT_WIDTH / 2, height + burnerOpeningHeight / 4, bottomWidth / 2, burnerOpeningHeight,
          0, Math.PI, 0, true ).lineTo( DEFAULT_WIDTH, burnerOpeningHeight / 2 );

      let stoveBody = new Path( stoveBodyShape, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
          .addColorStop( 0, options.baseColor.brighterColor( 0.5 ) )
          .addColorStop( 1, options.baseColor.darkerColor( 0.5 ) )
      } );

      // Create the label strings and scale them to support translations.
      let titleOptions = { font: options.labelFont, maxWidth: options.labelMaxWidth };
      let heatTitle = new Text( heatString, titleOptions );
      let coolTitle = new Text( coolString, titleOptions );
      let titles = [ heatTitle, coolTitle ];

      // Scale the titles to fit within the bucket front if necessary.
      let maxTitleWidth = Math.max( coolTitle.width, heatTitle.width );
      if ( maxTitleWidth > bottomWidth / 2 ) {
        titles.forEach( function( title ) {
          title.scale( ( bottomWidth / 2 ) / maxTitleWidth );
        } );
      }

      // Create the slider.
      assert && assert( ( options.coolEnabled || options.heatEnabled ), 'Either heating or cooling must be enabled.' );

      // @protected
      this.heatCoolSlider = new VSlider( heatCoolAmountProperty,
        new Range( options.coolEnabled ? -1 : 0, options.heatEnabled ? 1 : 0 ), {
          trackSize: new Dimension2( DEFAULT_WIDTH / 2, 10 ),
          trackFillEnabled: new LinearGradient( 0, 0, DEFAULT_WIDTH / 2, 0 )
            .addColorStop( 0, '#0A00F0' )
            .addColorStop( 1, '#EF000F' ),
          thumbSize: options.thumbSize,
          thumbTouchAreaXDilation: options.thumbTouchAreaXDilation,
          thumbTouchAreaYDilation: options.thumbTouchAreaYDilation,
          thumbMouseAreaXDilation: options.thumbMouseAreaXDilation,
          thumbMouseAreaYDilation: options.thumbMouseAreaYDilation,
          majorTickLength: 15,
          minorTickLength: 12,
          centerY: stoveBody.centerY,
          right: stoveBody.right - DEFAULT_WIDTH / 8,
          endDrag: function() {
            if ( options.snapToZero ) {
              heatCoolAmountProperty.set( 0 );
            }
          }
        } );
      if ( options.heatEnabled ) { this.heatCoolSlider.addMajorTick( 1, heatTitle ); }
      this.heatCoolSlider.addMinorTick( 0 );
      if ( options.coolEnabled ) { this.heatCoolSlider.addMajorTick( -1, coolTitle ); }

      this.addChild( stoveBody );
      this.addChild( this.heatCoolSlider );

      this.mutate( options );
    }

    /**
     * @public
     */
    dispose() {
      Node.prototype.dispose.call( this );
    }
  }

  return sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );
} );
