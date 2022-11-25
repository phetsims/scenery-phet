// Copyright 2002-2014, University of Colorado Boulder

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

  // strings
  var titleString = require( 'string!SCENERY_PHET/webglWarning.title' );
  var bodyString = require( 'string!SCENERY_PHET/webglWarning.body' );

  /**
   * @constructor
   */
  function CanvasWarningNode() {
    HBox.call( this, _.extend( {
      children: [
        new FontAwesomeNode( 'warning_sign', {
          fill: '#E87600', // "safety orange", according to Wikipedia
          scale: 0.6
        } ),
        new VBox( {
          children: [
            new Text( titleString, {
              font: new PhetFont( 14 ),
              fill: '#ddd'
            } ),
            new Text( bodyString, {
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
        if ( !window.phet || !phet.chipper || !phet.chipper.queryParameters || phet.chipper.queryParameters.allowLinks ) {
          var phetWindow = window.open( 'http://phet.colorado.edu/webgl-disabled-page?simLocale=' + phet.joist.sim.locale, '_blank' );
          phetWindow && phetWindow.focus();
        }
      }
    } );
  }

  return inherit( HBox, CanvasWarningNode );
} );
