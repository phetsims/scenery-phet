/**
 * This is the graphical representation of a stove that can be used to heat or cool things.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var HSlider = require( 'SUN/HSlider' );
  var Property = require( 'AXON/Property' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  //images
  var fireImage = require( 'image!SCENERY_PHET/flame.png' );
  var iceImage = require( 'image!SCENERY_PHET/ice-cube-stack.png' );

  // strings
  var heatString = require( 'string!SCENERY_PHET/heat' );
  var coolString = require( 'string!SCENERY_PHET/cool' );

  /**
   * Constructor for a HeaterCoolerNode.
   *
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function HeaterCoolerNode( options ) {

    Node.call( this, options );

    options = _.extend( {
      baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
      width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
      snapToZero: true, // controls whether the slider will snap to the off.
      heatCoolLevelProperty: new Property( 0 ) // Property set through interaction with slider.  Max value for heating, min for cooling.
    }, options );

    // Dimensions for the rest of the stove, dependent on the desired stove width.
    var height = options.width * 0.75;
    var burnerOpeningHeight = options.width * 0.1;
    var bottomWidth = options.width * 0.8;

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

    // Create the inside bowl of the burner, which is an ellipse.
    var burnerInteriorShape = new Shape()
      .ellipse( options.width / 2, burnerOpeningHeight / 4, options.width / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false );
    var burnerInterior = new Path( burnerInteriorShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, options.width, 0 )
        .addColorStop( 0, options.baseColor.darkerColor( 0.5 ) )
        .addColorStop( 1, options.baseColor.brighterColor( 0.5 ) )
    } );

    // Create the label strings and scale them to support translations.
    var labelFont = new PhetFont( 14 );
    var heatTitle = new Text( heatString, { font: labelFont, rotation: Math.PI / 2 } );
    var coolTitle = new Text( coolString, { font: labelFont, rotation: Math.PI / 2 } );
    var titles = [ heatTitle, coolTitle ];

    //  Get the widest title by comparing their height since they are rotated.
    var maxTitleWidth = Math.max( coolTitle.height, heatTitle.height );
    if ( maxTitleWidth > bottomWidth / 2 ) {
      titles.forEach( function( title ) {
        title.scale( ( bottomWidth / 2 ) / maxTitleWidth );
      } );
    }

    // Create the slider.
    var heatCoolSlider = new HSlider( options.heatCoolLevelProperty, { min: -1, max: 1 },
      {
        endDrag: function() {
          if ( options.snapToZero ) {
            options.heatCoolLevelProperty.value = 0;
          }
        },
        trackSize: new Dimension2( options.width / 2, 10 ),
        trackFill: new LinearGradient( 0, 0, options.width / 2, 0 )
          .addColorStop( 0, '#0A00F0' )
          .addColorStop( 1, '#EF000F' ),
        thumbSize: new Dimension2( 15, 30 ),
        majorTickLength: 15,
        minorTickLength: 12,
        rotation: -Math.PI / 2,
        centerY: stoveBody.centerY,
        right: stoveBody.right - options.width / 8
      } );
    heatCoolSlider.addMajorTick( 1, heatTitle );
    heatCoolSlider.addMinorTick( 0 );
    heatCoolSlider.addMajorTick( -1, coolTitle );

    var fireNode = new Image( fireImage, { centerX: stoveBody.centerX, centerY: stoveBody.centerY } );
    var iceNode = new Image( iceImage, { centerX: stoveBody.centerX, centerY: stoveBody.centerY } );
    options.heatCoolLevelProperty.link( function( heat ) {
      if ( heat > 0 ) {
        fireNode.setTranslation( (stoveBody.width - fireNode.width) / 2, -heat * fireImage.height * 0.85 );
      }
      else if ( heat < 0 ) {
        iceNode.setTranslation( (stoveBody.width - iceNode.width) / 2, heat * iceImage.height * 0.85 );
      }
      iceNode.setVisible( heat < 0 );
      fireNode.setVisible( heat > 0 );
    } );

    this.addChild( burnerInterior );
    this.addChild( fireNode );
    this.addChild( iceNode );
    this.addChild( stoveBody );
    this.addChild( heatCoolSlider );

    this.mutate( options );

  }

  return inherit( Node, HeaterCoolerNode );
} );

