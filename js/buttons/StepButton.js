// Copyright 2014-2016, University of Colorado Boulder

/**
 * Generalized button for stepping forward or back.
 * See also StepForwardButton and StepBackButton, which provide some additional convenience behavior.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} [options] - see RoundPushButton
   * @constructor
   */
  function StepButton( options ) {

    options = _.extend( {
      direction: 'forward', // {string} 'forward'|'back'
      radius: 20,
      fireOnHold: true,
      iconFill: 'black'
    }, options );
    
    assert && assert( options.direction === 'forward' || options.direction === 'back',
    'unsupported direction: ' + options.direction );

    // step icon is sized relative to the radius
    var BAR_WIDTH = options.radius * 0.15;
    var BAR_HEIGHT = options.radius * 0.9;
    var TRIANGLE_WIDTH = options.radius * 0.65;
    var TRIANGLE_HEIGHT = BAR_HEIGHT;

    // icon, in 'forward' orientation
    var barPath = new Rectangle( 0, 0, BAR_WIDTH, BAR_HEIGHT, { fill: options.iconFill } );
    var trianglePath = new Path( new Shape()
      .moveTo( 0, TRIANGLE_HEIGHT / 2 )
      .lineTo( TRIANGLE_WIDTH, 0 )
      .lineTo( 0, -TRIANGLE_HEIGHT / 2 )
      .close(), {
      fill: options.iconFill
    } );
    var stepIcon =  new HBox( {
      children: [ barPath, trianglePath ],
      spacing: BAR_WIDTH,
      rotation: ( options.direction === 'forward' )? 0 : Math.PI
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = stepIcon;

    RoundPushButton.call( this, options );
  }

  sceneryPhet.register( 'StepButton', StepButton );

  return inherit( RoundPushButton, StepButton );
} );