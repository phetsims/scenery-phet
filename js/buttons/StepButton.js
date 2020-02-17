// Copyright 2014-2019, University of Colorado Boulder

/**
 * Generalized button for stepping forward or back.  While this class is not private, clients will generally use the
 * convenience subclasses: StepForwardButton and StepBackwardButton
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const Shape = require( 'KITE/Shape' );

  // a11y strings
  const stepForwardString = SceneryPhetA11yStrings.stepForwardString.value;
  const stepPlayingDescriptionString = SceneryPhetA11yStrings.stepPlayingDescriptionString.value;
  const stepPausedDescriptionString = SceneryPhetA11yStrings.stepPausedDescriptionString.value;

  /**
   * @param {Object} [options] - see RoundPushButton
   * @constructor
   */
  function StepButton( options ) {

    // these options are used in computation of other default options
    const BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 20;
    const DIRECTION = ( options && options.direction ) ? options.direction : 'forward';

    options = merge( {
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

      // PDOM
      innerContent: stepForwardString,
      appendDescription: true
    }, options );

    assert && assert( options.direction === 'forward' || options.direction === 'backward',
      'unsupported direction: ' + options.direction );

    // step icon is sized relative to the radius
    const BAR_WIDTH = options.radius * 0.15;
    const BAR_HEIGHT = options.radius * 0.9;
    const TRIANGLE_WIDTH = options.radius * 0.65;
    const TRIANGLE_HEIGHT = BAR_HEIGHT;

    // icon, in 'forward' orientation
    const barPath = new Rectangle( 0, 0, BAR_WIDTH, BAR_HEIGHT, { fill: options.iconFill } );
    const trianglePath = new Path( new Shape()
      .moveTo( 0, TRIANGLE_HEIGHT / 2 )
      .lineTo( TRIANGLE_WIDTH, 0 )
      .lineTo( 0, -TRIANGLE_HEIGHT / 2 )
      .close(), {
      fill: options.iconFill
    } );
    const stepIcon = new HBox( {
      children: [ barPath, trianglePath ],
      spacing: BAR_WIDTH,
      rotation: ( options.direction === 'forward' ) ? 0 : Math.PI
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = stepIcon;

    RoundPushButton.call( this, options );

    // Disable the button when the sim is playing
    if ( options.isPlayingProperty ) {
      const self = this;
      var playingObserver = function( playing ) {
        self.enabled = !playing;

        self.descriptionContent = playing ? stepPlayingDescriptionString : stepPausedDescriptionString;
      };
      options.isPlayingProperty.link( playingObserver );
    }

    // @private
    this.disposeStepButton = function() {
      options.isPlayingProperty && options.isPlayingProperty.unlink( playingObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StepButton', this );
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