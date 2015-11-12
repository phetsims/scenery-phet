// Copyright 2013-2015, University of Colorado Boulder

/**
 * Reset All button.  This version is drawn in code using shapes, gradients,
 * and such, and does not use any image files.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var ResetAllShape = require( 'SCENERY_PHET/ResetAllShape' );

  // strings
  var resetAllButtonNameString = require( 'string!SCENERY_PHET/ResetAllButton.name' );
  var resetAllButtonDescriptionString = require( 'string!SCENERY_PHET/ResetAllButton.description' );

  // constants
  var DEFAULT_RADIUS = 24; // Derived from images initially used for reset button.

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {
    var buttonRadius = ( options && options.radius ) ? options.radius : DEFAULT_RADIUS;
    options = _.extend( {
      // Default values
      radius: DEFAULT_RADIUS,
      minXMargin: buttonRadius * 0.2,

      // Default orange color scheme, standard for PhET reset buttons
      baseColor: new Color( 247, 151, 34 ),

      // The arrow shape doesn't look right when perfectly centered, account
      // for that here, and see docs in RoundButtonView.  The multiplier
      // values were empirically determined.
      xContentOffset: buttonRadius * 0.03,
      yContentOffset: buttonRadius * ( -0.0125 ),
      textDescription: 'Reset All Button',

      // Marker entry to indicate that tandem is supported (in the parent)
      tandem: null
    }, options );

    var icon = new Path( new ResetAllShape( options.radius ), { fill: 'white' } );

    RoundPushButton.call( this, _.extend( {
      content: icon,
      accessibleContent: {
        focusHighlight: new Shape().circle( 0, 0, buttonRadius ),

        /**
         * Create an element for the ResetAllButton in the parallel DOM and set its attributes.
         *
         * @param {AccessibleInstance} accessibleInstance
         * @returns {AccessiblePeer}
         */
        createPeer: function( accessibleInstance ) {
          // will look like <input value="Reset" type="reset" tabindex="0">
          var domElement = document.createElement( 'input' );
          domElement.value = resetAllButtonNameString;
          domElement.type = 'reset';
          domElement.tabIndex = '0';

          // create an aria element that describes the button
          var descriptionElement = document.createElement( 'p' );
          descriptionElement.innerText = resetAllButtonDescriptionString;
          descriptionElement.id = 'pause-description';

          domElement.setAttribute( 'aria-describedby', descriptionElement.id );

          domElement.addEventListener( 'click', function() {
            options.listener();
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    }, options ) );
  }

  return inherit( RoundPushButton, ResetAllButton );
} );
