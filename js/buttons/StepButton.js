// Copyright 2014-2018, University of Colorado Boulder

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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var Shape = require( 'KITE/Shape' );

  // a11y strings
  var stepString = SceneryPhetA11yStrings.stepString.value;
  var stepDescriptionString = SceneryPhetA11yStrings.stepDescriptionString.value;

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
      isPlayingProperty: null,

      // a11y
      innerContent: stepString,
      containerTagName: 'div',
      descriptionContent: stepDescriptionString
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
    if ( options.isPlayingProperty ) {
      var self = this;
      var playingObserver = function( playing ) {
        self.enabled = !playing;
      };
      options.isPlayingProperty.link( playingObserver );
    }

    // @private
    this.disposeStepButton = function() {
      options.isPlayingProperty && options.isPlayingProperty.unlink( playingObserver );
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