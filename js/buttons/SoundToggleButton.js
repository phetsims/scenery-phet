// Copyright 2014-2018, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var Shape = require( 'KITE/Shape' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // constants
  var WIDTH = 45;
  var HEIGHT = 45;
  var MARGIN = 4;
  var X_WIDTH = WIDTH * 0.25; // Empirically determined.

  // a11y strings
  var soundToggleLabelString = SceneryPhetA11yStrings.soundToggleLabelString.value;
  var simSoundOnString = SceneryPhetA11yStrings.simSoundOnString.value;
  var simSoundOffString = SceneryPhetA11yStrings.simSoundOffString.value;

  /**
   *
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   * @constructor
   */
  function SoundToggleButton( property, options ) {

    // 'on' icon is a font-awesome icon
    var soundOnNode = new FontAwesomeNode( 'volume_up' );
    var contentScale = (WIDTH - (2 * MARGIN)) / soundOnNode.width;
    soundOnNode.scale( contentScale );

    // 'off' icon is a font-awesome icon, with an 'x' added to the right.
    var soundOffNode = new Node();
    soundOffNode.addChild( new FontAwesomeNode( 'volume_off', { scale: contentScale } ) );
    var soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ), {
      stroke: 'black',
      lineWidth: 3,
      right: soundOnNode.width, // position the 'x' so that both icons have the same width, see scenery-phet#329
      centerY: soundOffNode.centerY
    } );
    soundOffNode.addChild( soundOffX );

    BooleanRectangularToggleButton.call( this, soundOnNode, soundOffNode, property, _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN,

      // a11y
      tagName: 'button',
      innerContent: soundToggleLabelString
    }, options ) );

    var self = this;

    // accessible attribute lets user know when the toggle is pressed, linked lazily so that an alert isn't triggered
    // on construction and must be unlinked in dispose
    var pressedListener = function( value ) {
      self.setAccessibleAttribute( 'aria-pressed', !value );

      var alertString = value ? simSoundOnString : simSoundOffString;
      utteranceQueue.addToBack( alertString );
    };
    property.lazyLink( pressedListener );
    self.setAccessibleAttribute( 'aria-pressed', !property.get() );

    // @private - make eligible for garbage collection
    this.disposeSoundToggleButton = function() {
      property.unlink( pressedListener );
    };
  }

  sceneryPhet.register( 'SoundToggleButton', SoundToggleButton );

  return inherit( BooleanRectangularToggleButton, SoundToggleButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.disposeSoundToggleButton();
      BooleanRectangularToggleButton.prototype.dispose.call( this );
    }
  } );
} );