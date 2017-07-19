// Copyright 2014-2016, University of Colorado Boulder

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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // constants
  var WIDTH = 45;
  var HEIGHT = 45;
  var MARGIN = 4;
  var X_WIDTH = WIDTH * 0.25; // Empirically determined.

  /**
   *
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   * @constructor
   */
  function SoundToggleButton( property, options ) {

    var soundOffNode = new Node();
    var soundOnNode = new FontAwesomeNode( 'volume_up' );
    var contentScale = ( WIDTH - ( 2 * MARGIN ) ) / soundOnNode.width;
    soundOnNode.scale( contentScale );
    soundOffNode.addChild( new FontAwesomeNode( 'volume_off', { scale: contentScale } ) );
    var soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ), {
      stroke: 'black',
      lineWidth: 3,
      left: soundOffNode.width + 5,
      centerY: soundOffNode.centerY
    } );
    soundOffNode.addChild( soundOffX );

    BooleanRectangularToggleButton.call( this, soundOnNode, soundOffNode, property, _.extend( {
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN,

      // a11y
      tagName: 'button',
      accessibleLabel: SceneryPhetA11yStrings.soundToggleLabelString
    }, options ) );

    // dilate the focus highlight bounds to give the button some space
    this.focusHighlight = new Shape.bounds( this.localBounds.dilated( 5 ) );

    var self = this;

    // accessibility input listener - must be removed in dispose
    var clickListener = this.addAccessibleInputListener( {
      click: function( event ) {
        self.buttonModel.toggle();
      }
    } );

    // accessible attribute lets user know when the toggle is pressed, linked lazily so that an alert isn't triggered
    // on construction and must be unlinked in dispose
    var pressedListener = function( value ) {
      self.setAccessibleAttribute( 'aria-pressed', !value );

      var alertString = value ? SceneryPhetA11yStrings.simSoundOnString : SceneryPhetA11yStrings.simSoundOffString;
      AriaHerald.announcePolite( alertString );
    };
    property.lazyLink( pressedListener );
    self.setAccessibleAttribute( 'aria-pressed', !property.get() );

    // @private - make eligible for garbage collection
    this.disposeSoundToggleButton = function() {
      self.removeAccessibleInputListener( clickListener );
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