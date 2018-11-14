// Copyright 2018, University of Colorado Boulder

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
  const DEFAULT_HEAT_COOL_AMOUNT_PROPERTY = new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } );

  class HeaterCoolerFront extends Node {
    /**
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    constructor( options ) {
      super();
      Tandem.indicateUninstrumentedCode();
      options = _.extend( {
        baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
        width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
        snapToZero: true, // controls whether the slider will snap to the off.
        heatCoolAmountProperty: DEFAULT_HEAT_COOL_AMOUNT_PROPERTY, // Property set through interaction with slider.
        heatEnabled: true, // Can this node heat the environment?
        coolEnabled: true // Can this node cool the environment?
      }, options );

      // Dimensions for the rest of the stove, dependent on the specified stove width.  Empirically determined, and could
      // be made into options if needed.
      let height = options.width * 0.75;
      let burnerOpeningHeight = options.width * HeaterCoolerBack.OPENING_HEIGHT_SCALE;
      let bottomWidth = options.width * 0.80;

      // Create the body of the stove.
      let stoveBodyShape = new Shape().ellipticalArc( options.width / 2, burnerOpeningHeight / 4, options.width / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false ).lineTo( ( options.width - bottomWidth ) / 2, height + burnerOpeningHeight / 2 ).ellipticalArc( options.width / 2, height + burnerOpeningHeight / 4, bottomWidth / 2, burnerOpeningHeight,
        0, Math.PI, 0, true ).lineTo( options.width, burnerOpeningHeight / 2 );

      let stoveBody = new Path( stoveBodyShape, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, options.width, 0 )
          .addColorStop( 0, options.baseColor.brighterColor( 0.5 ) )
          .addColorStop( 1, options.baseColor.darkerColor( 0.5 ) )
      } );

      // Create the label strings and scale them to support translations.
      let titleOptions = { font: new PhetFont( 14 ) };
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
      let heatCoolSlider = new VSlider( options.heatCoolAmountProperty,
        new Range( options.coolEnabled ? -1 : 0, options.heatEnabled ? 1 : 0 ), {
          trackSize: new Dimension2( options.width / 2, 10 ),
          trackFillEnabled: new LinearGradient( 0, 0, options.width / 2, 0 )
            .addColorStop( 0, '#0A00F0' )
            .addColorStop( 1, '#EF000F' ),
          thumbSize: new Dimension2( 15, 30 ),
          majorTickLength: 15,
          minorTickLength: 12,
          centerY: stoveBody.centerY,
          right: stoveBody.right - options.width / 8,
          endDrag: function() {
            if ( options.snapToZero ) {
              options.heatCoolAmountProperty.set( 0 );
            }
          }
        } );
      if ( options.heatEnabled ) { heatCoolSlider.addMajorTick( 1, heatTitle ); }
      heatCoolSlider.addMinorTick( 0 );
      if ( options.coolEnabled ) { heatCoolSlider.addMajorTick( -1, coolTitle ); }

      this.addChild( stoveBody );
      this.addChild( heatCoolSlider );

      this.mutate( options );

      // @public Dispose function used for GC
      this.disposeHeaterCoolerFront = function() {
        options.heatCoolAmountProperty.dispose();
      };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeHeaterCoolerFront();
    }
  }

  return sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );
} );
