// Copyright 2013-2016, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var Shape = require( 'KITE/Shape' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // strings
  var resetAllButtonNameString = require( 'string!SCENERY_PHET/ResetAllButton.name' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {

    options = _.extend( {
      radius: 24, // derived from the image files that were originally used for this button
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      textDescription: 'Reset All Button', //TODO document, is this for a11y?
      tandem: null // Marker entry to indicate that tandem is supported (in the parent)
    }, options );

    // a11y
    assert && assert( !options.accessibleContent, 'accessibleContent is not customizable' );
    options.accessibleContent = {
      
      focusHighlight: new Shape().circle( 0, 0, options.radius ),

      /**
       * Create an element for the ResetAllButton in the parallel DOM and set its attributes.
       *
       * @param {AccessibleInstance} accessibleInstance
       * @returns {AccessiblePeer}
       */
      createPeer: function( accessibleInstance ) {
        
        // will look like <input value="Reset All" type="reset" tabindex="0">
        var domElement = document.createElement( 'input' );
        domElement.value = resetAllButtonNameString;
        domElement.type = 'reset';
        domElement.tabIndex = '0';

        domElement.addEventListener( 'click', function() {
          options.listener();
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };

    ResetButton.call( this, options );
  }

  sceneryPhet.register( 'ResetAllButton', ResetAllButton );

  return inherit( ResetButton, ResetAllButton );
} );
