// Copyright 2018, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ContextLossFailureDialog = require( 'SCENERY_PHET/ContextLossFailureDialog' );
  var DemosScreenView = require( 'SUN/demo/DemosScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var BUTTON_LABEL_FONT = new PhetFont( 20 );

  /**
   * @constructor
   */
  function DialogsScreenView() {
    ScreenView.call( this );

    var contextLossFailureButton = new RectangularPushButton( {
      content: new Text( 'content loss failure', { font: BUTTON_LABEL_FONT } ),
      listener: function() {
        new ContextLossFailureDialog().show();
      }
    } );

    this.addChild( new VBox( {
      children: [ contextLossFailureButton ],
      center: this.layoutBounds.center
    } ) );
  }

  sceneryPhet.register( 'DialogsScreenView', DialogsScreenView );

  return inherit( DemosScreenView, DialogsScreenView );
} );