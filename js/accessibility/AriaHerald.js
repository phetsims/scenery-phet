// Copyright 2017, University of Colorado Boulder

/**
 * A static object used to send aria-live updates to a screen reader. These are alerts that are independent of user
 * focus. This will simply reference 'aria-live' elements in the HTML document and update their content. ARIA
 * attributes specify the behavior of timing for the alerts. The following HTML element must be in the document
 *
 *    <p id="polite" aria-live="polite"></p>
 *
 * Many aria-live and related attributes were tested, but none were well supported or particularly useful for PhET sims,
 * see https://github.com/phetsims/chipper/issues/472.
 *
 * NOTE: AriaHerald is just an Object, not a type, but it needs to be initialized before use as a singleton.
 * As of this writing (Nov 2017) this initialization occurs in Sim.js. Therefore if something uses AriaHerald
 * before Sim.js has initialized this file, the result will be a silent no-op.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Timer = require( 'PHET_CORE/Timer' );

  // ids for the aria-live elements
  var POLITE_ELEMENT_ID = 'polite';
  var ALERT_CONTAINER_ELEMENT_ID = 'aria-live-elements';

  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  var DEFAULT_WITH_CLEAR = true;

  // If not initialized, then AriaHerald will no-op for all functionality
  var initialized = false;

  // verify that container is present
  assert && assert( document.getElementById( ALERT_CONTAINER_ELEMENT_ID ), 'No alert container element found in document' );

  // DOM element which will receive the updated content
  var politeElement = document.getElementById( POLITE_ELEMENT_ID );

  // verify that all elements are present
  assert && assert( politeElement, 'No polite element found in document' );

  /**
   * Update an element with the 'aria-live' attribute by setting its text content.
   * If using withClear, old element text content will be explicitly removed before new text content is set.  This will
   * allow sequential alerts with identical text content to be announced multiple times in a row, which some screen
   * readers might have prevented.
   *
   * @param {HTMLElement} liveElement - the HTML element that will send the alert to the assistive technology
   * @param {string} textContent - the content to be announced
   * @param {boolean} [withClear] - optional, whether or not to remove the old text content before updating the element
   */
  function updateLiveElement( liveElement, textContent, withClear ) {

    // no-op if not initialized
    if ( !initialized ) {
      return;
    }

    withClear = ( withClear === undefined ) ? DEFAULT_WITH_CLEAR : withClear;
    assert && assert( typeof withClear === 'boolean', 'withClear must be of type boolean' );

    // clearing the old content allows repeated alerts
    if ( withClear ) { liveElement.textContent = ''; }

    liveElement.textContent = textContent;

    // after a small delay, remove this alert content from the DOM so that it cannot be found again - must occur
    // after a delay for screen reader to register the change in text content
    Timer.setTimeout( function() { liveElement.textContent = ''; }, 200 );
  }

  /**
   * Static object that provides the functions for updating the aria-live regions for screen reader announcements.
   */
  var AriaHerald = {

    /**
     * Initialize AriaHerald to allow usage of its features. If not initialized, then it will no-op. This allows
     * AriaHerald to be disabled completely if a11y is not enabled.
     */
    initialize: function() {
      initialized = true;
    },

    /**
     * Announce a polite alert.  This alert should be announced when the user has finished their current interaction or
     * after other utterances in the screen reader's queue are finished.
     * @public
     *
     * @param {string} textContent - the polite content to announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announcePolite: function( textContent, withClear ) {
      updateLiveElement( politeElement, textContent, withClear );
    },

    /**
     * Clear all alerts by resetting text content with empty strings. A screen reader will not announce anything, but
     * this will remove all text content from the aria-live elements so that it cannot be found by the virtual cursor.
     * @public
     */
    clearAll: function() {
      AriaHerald.clearPolite();
    },

    /**
     * Clear the text content from the polite alert element.  AT will not announce anything but this will prevent
     * text content from being found in the document with the virtual cursor.
     * @public
     */
    clearPolite: function() {

      // no-op if not initialized
      if ( !initialized ) {
        return;
      }

      politeElement.textContent = '';
    },

    // static constants
    POLITE_ELEMENT_ID: POLITE_ELEMENT_ID,
    ALERT_CONTAINER_ELEMENT_ID: ALERT_CONTAINER_ELEMENT_ID
  };

  sceneryPhet.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );