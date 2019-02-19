// Copyright 2018-2019, University of Colorado Boulder

/**
 * "definition" type for generalized alerts (anything that can be spoken by an
 * assistive device without requiring active focus). This includes anything
 * that can move through utteranceQueue. 
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );

  var AlertableDef = {

    /**
     * Returns whether the parameter is considered to be a alertable, for use in utteranceQueue. An item is alertable
     * if it passes isItemAlertable, OR is an array of those items. See isItemAlertable for supported types of
     * individual items. See utterance.js for documentation about why an array is beneficial.
     * @param  {*}  alertable
     * @returns {boolean}
     * @public
     */
    isAlertableDef: function( alertable ) {
      var isAlertable = true;

      // if array, check each item individually
      if ( Array.isArray( alertable ) ) {
        for ( var i = 0; i < alertable.length; i++ ) {
          isAlertable = isItemAlertable( alertable[ i ] );
          if ( !isAlertable ) { break; }
        }
      }
      else {
        isAlertable = isItemAlertable( alertable );
      }

      return isAlertable;
    }
  };

  /**
   * Check whether a single item is alertable.
   * @param  {*}  alertable
   * @returns {boolean} - returns true if the arg is an alertable item.
   */
  var isItemAlertable = function( alertable ) {
    return typeof alertable === 'string' ||
           typeof alertable === 'number' ||
           alertable instanceof Utterance;
  };

  sceneryPhet.register( 'AlertableDef', AlertableDef );

  return AlertableDef;

} );
