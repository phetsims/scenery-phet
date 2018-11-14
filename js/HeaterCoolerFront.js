// Copyright 2018, University of Colorado Boulder

/**
 * Front of the HeaterCoolerNode.  It is independent from the HeaterCoolerBack so that one can easily layer objects
 * inside of the HeaterCoolerNode.  The HeaterCoolerFront contains the heater body, labels, and control slider.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VSlider = require( 'SUN/VSlider' );

  // strings
  var coolString = require( 'string!SCENERY_PHET/cool' );
  var heatString = require( 'string!SCENERY_PHET/heat' );

  /**
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function HeaterCoolerFront( options ) {
    Tandem.indicateUninstrumentedCode();

    Node.call( this );

    options = _.extend( {
      baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
      width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
      snapToZero: true, // controls whether the slider will snap to the off.
      heatCoolAmountProperty: new Property( 0 ), // Property set through interaction with slider.  +1 for max heating, -1 for max cooling.
      heatEnabled: true, // Can this node heat the environment?
      coolEnabled: true // Can this node cool the environment?
    }, options );

    // Dimensions for the rest of the stove, dependent on the specified stove width.  Empirically determined, and could
    // be made into options if needed.
    var height = options.width * 0.75;
    var burnerOpeningHeight = options.width * HeaterCoolerBack.OPENING_HEIGHT_SCALE();
    var bottomWidth = options.width * 0.80;

    // Create the body of the stove.
    var stoveBodyShape = new Shape().
      ellipticalArc( options.width / 2, burnerOpeningHeight / 4, options.width / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false ).
      lineTo( ( options.width - bottomWidth ) / 2, height + burnerOpeningHeight / 2 ).
      ellipticalArc( options.width / 2, height + burnerOpeningHeight / 4, bottomWidth / 2, burnerOpeningHeight,
      0, Math.PI, 0, true ).
      lineTo( options.width, burnerOpeningHeight / 2 );

    var stoveBody = new Path( stoveBodyShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, options.width, 0 )
        .addColorStop( 0, options.baseColor.brighterColor( 0.5 ) )
        .addColorStop( 1, options.baseColor.darkerColor( 0.5 ) )
    } );

    // Create the label strings and scale them to support translations.
    var titleOptions = { font: new PhetFont( 14 ) };
    var heatTitle = new Text( heatString, titleOptions );
    var coolTitle = new Text( coolString, titleOptions );
    var titles = [ heatTitle, coolTitle ];

    // Scale the titles to fit within the bucket front if necessary.
    var maxTitleWidth = Math.max( coolTitle.width, heatTitle.width );
    if ( maxTitleWidth > bottomWidth / 2 ) {
      titles.forEach( function( title ) {
        title.scale( ( bottomWidth / 2 ) / maxTitleWidth );
      } );
    }

    // Create the slider.
    assert && assert( ( options.coolEnabled || options.heatEnabled ), 'Either heating or cooling must be enabled.' );
    var heatCoolSlider = new VSlider( options.heatCoolAmountProperty,
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
    if( options.heatEnabled ) { heatCoolSlider.addMajorTick( 1, heatTitle ); }
    heatCoolSlider.addMinorTick( 0 );
    if( options.coolEnabled ) { heatCoolSlider.addMajorTick( -1, coolTitle ); }

    this.addChild( stoveBody );
    this.addChild( heatCoolSlider );

    this.mutate( options );
  }

  sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );

  return inherit( Node, HeaterCoolerFront );
} );
