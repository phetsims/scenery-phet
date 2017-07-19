// Copyright 2014-2016, University of Colorado Boulder

/**
 * Generalized button for stepping forward or back.  While this class is not private, clients will generally use the
 * convenience subclasses: StepForwardButton and StepBackwardButton
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

    // these options are used in computation of other default options
    var BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 20;
    var DIRECTION = ( options && options.direction ) ? options.direction : 'forward';

    options = _.extend( {
      direction: DIRECTION, // {string} 'forward'|'backward'
      radius: BUTTON_RADIUS,
      fireOnHold: true,
      iconFill: 'black',

      // shift the content to center align, assumes 3D appearance and specific content
      xContentOffset: ( DIRECTION === 'forward' ) ? ( 0.075 * BUTTON_RADIUS ) : ( -0.15 * BUTTON_RADIUS ),

      // {Property.<boolean>|null} is the sim playing? This is a convenience option.
      // If this Property is provided, it will disable the button while the sim is playing,
      // and you should avoid using the button's native 'enabled' property.
      playingProperty: null
    }, options );

    assert && assert( options.direction === 'forward' || options.direction === 'backward',
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
    var stepIcon = new HBox( {
      children: [ barPath, trianglePath ],
      spacing: BAR_WIDTH,
      rotation: ( options.direction === 'forward' ) ? 0 : Math.PI
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = stepIcon;

    RoundPushButton.call( this, options );

    // Disable the button when the sim is playing
    if ( options.playingProperty ) {
      var self = this;
      var playingObserver = function( playing ) { 
        self.enabled = !playing; 

        // a11y
        self.focusable = !playing;
      };
      options.playingProperty.link( playingObserver );
    }

    // @private
    this.disposeStepButton = function() {
      options.playingProperty && options.playingProperty.unlink( playingObserver );
    };
  }

  sceneryPhet.register( 'StepButton', StepButton );

  return inherit( RoundPushButton, StepButton, {

    // @public
    dispose: function() {
      this.disposeStepButton();
      RoundPushButton.prototype.dispose.call( this );
    }
  } );
} );