// Copyright 2014-2017, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ZoomButton( options ) {

    options = _.extend( {
      in: true, // true: zoom-in button, false: zoom-out button
      radius: 15,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      magnifyingGlassFill: 'white', // center of the glass
      magnifyingGlassStroke: 'black', // rim and handle
      tandem: Tandem.required
    }, options );

    // the magnifying glass
    var glassLineWidth = 0.25 * options.radius;
    var glassNode = new Circle( options.radius, {
      fill: options.magnifyingGlassFill,
      stroke: options.magnifyingGlassStroke,
      lineWidth: glassLineWidth,
      tandem: options.tandem.createTandem( 'glassNode' )
    } );

    // handle at lower-left of glass, at a 45-degree angle
    var outsideRadius = options.radius + ( glassLineWidth / 2 ); // use outside radius so handle line cap doesn't appear inside glassNode
    var handleNode = new Line(
      outsideRadius * Math.cos( Math.PI / 4 ), outsideRadius * Math.sin( Math.PI / 4 ),
      options.radius * Math.cos( Math.PI / 4 ) + ( 0.65 * options.radius ), options.radius * Math.sin( Math.PI / 4 ) + ( 0.65 * options.radius ), {
        stroke: options.magnifyingGlassStroke,
        lineWidth: 0.4 * options.radius,
        lineCap: 'round'
      } );

    // plus or minus sign in middle of magnifying glass
    var signOptions = {
      size: new Dimension2( 1.3 * options.radius, options.radius / 3 ),
      centerX: glassNode.centerX,
      centerY: glassNode.centerY,
      tandem: options.tandem.createTandem( 'signNode' )
    };
    var signNode = options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions );

    options.content = new Node( { children: [ handleNode, glassNode, signNode ] } );

    RectangularPushButton.call( this, options );
  }

  sceneryPhet.register( 'ZoomButton', ZoomButton );

  return inherit( RectangularPushButton, ZoomButton );
} );
