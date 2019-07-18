// Copyright 2017-2019, University of Colorado Boulder

/**
 * A button whose icon means 'move to trash'.
 * The arrow can be color-coded to the thing being deleted by setting options.arrowColor.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  const ButtonInteractionState = require( 'SUN/buttons/ButtonInteractionState' );
  const Color = require( 'SCENERY/util/Color' );
  const CurvedArrowShape = require( 'SCENERY_PHET/CurvedArrowShape' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const DISABLED_COLOR = 'rgba( 0, 0, 0, 0.3 )';

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function MoveToTrashButton( options ) {

    options = _.extend( {

      // {Color|string} by default the arrow is color-coded for thermal energy, see scenery-phet#320
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      arrowColor: 'black',
      cornerRadius: 6,
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      xMargin: 7,
      yMargin: 3,
      tandem: Tandem.required
    }, options );

    assert && assert( !options.contentAppearanceStrategy, 'MoveToTrashButton sets contentAppearanceStrategy' );
    options.contentAppearanceStrategy = function( content, interactionStateProperty ) {

      function updateEnabled( state ) {
        if ( content ) {
          var enabled = state !== ButtonInteractionState.DISABLED &&
                        state !== ButtonInteractionState.DISABLED_PRESSED;

          arrowPath.fill = enabled ? options.arrowColor : DISABLED_COLOR;
          trashPath.fill = enabled ? 'black' : DISABLED_COLOR;
        }
      }

      interactionStateProperty.link( updateEnabled );
      this.dispose = function() {
        interactionStateProperty.unlink( updateEnabled );
      };
    };

    var trashPath = new FontAwesomeNode( 'trash', { tandem: options.tandem.createTandem( 'trashPath' ) } );

    var arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
      tandem: options.tandem.createTandem( 'arrowShape' ),
      headWidth: 12,
      tailWidth: 4
    } );

    var arrowPath = new Path( arrowShape, {
      tandem: options.tandem.createTandem( 'arrowPath' ),
      bottom: trashPath.top,
      right: trashPath.left + trashPath.width * 0.75
    } );

    options.content = new Node( {
      children: [ trashPath, arrowPath ],
      scale: 0.4
    } );

    RectangularPushButton.call( this, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MoveToTrashButton', this );
  }

  sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );

  return inherit( RectangularPushButton, MoveToTrashButton );
} );