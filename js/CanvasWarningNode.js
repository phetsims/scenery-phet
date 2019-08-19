// Copyright 2015, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var webglWarningTitleString = require( 'string!SCENERY_PHET/webglWarning.title' );
  var webglWarningBodyString = require( 'string!SCENERY_PHET/webglWarning.body' );

  /**
   * @constructor
   */
  function CanvasWarningNode() {
    Tandem.indicateUninstrumentedCode();

    HBox.call( this, _.extend( {
      children: [
        new FontAwesomeNode( 'warning_sign', {
          fill: '#E87600', // "safety orange", according to Wikipedia
          scale: 0.6
        } ),
        new VBox( {
          children: [
            new Text( webglWarningTitleString, {
              font: new PhetFont( 14 ),
              fill: '#ddd'
            } ),
            new Text( webglWarningBodyString, {
              font: new PhetFont( 10 ),
              fill: '#999'
            } )
          ],
          spacing: 3,
          align: 'left'
        } )
      ],
      spacing: 12,
      align: 'center',
      cursor: 'pointer'
    } ) );

    this.mouseArea = this.touchArea = this.localBounds;

    this.addInputListener( {
      up: function() {
        var phetWindow = window.open( 'http://phet.colorado.edu/webgl-disabled-page?simLocale=' + phet.joist.sim.locale, '_blank' );
        phetWindow && phetWindow.focus();
      }
    } );
  }

  sceneryPhet.register( 'CanvasWarningNode', CanvasWarningNode );

  return inherit( HBox, CanvasWarningNode );
} );
