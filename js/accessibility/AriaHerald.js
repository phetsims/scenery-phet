// Copyright 2017, University of Colorado Boulder

/**
 * A static object used to send aria-live updates to a screen reader. These are alerts that are independent of user
 * focus. This will simply reference 'aria-live' elements in the HTML document and update their content. ARIA
 * attributes specify the behavior of timing for the alerts. The following alert elements must be in the HTML document
 *
 *    <p id="assertive" aria-live="assertive" aria-atomic="true"></p>
 *    <p id="polite" aria-live="polite" aria-atomic="true"></p>
 *
 * These attributes were tested and determined to be the most widely supported and most useful for PhET sims,
 * see https://github.com/phetsims/chipper/issues/472.
 * 
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Timer = require( 'PHET_CORE/Timer' );

  // ids for each of the aria-live elements
  var ASSERTIVE_ELEMENT_ID = 'assertive';
  var POLITE_ELEMENT_ID = 'polite';
  var ALERT_CONTAINER_ELEMENT_ID = 'aria-live-elements';

  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  var DEFAULT_WITH_CLEAR = true;

  // DOM elements which will receive the updated content
  var assertiveElement = document.getElementById( ASSERTIVE_ELEMENT_ID );
  var politeElement = document.getElementById( POLITE_ELEMENT_ID );
  var alertContainer = document.getElementById( ALERT_CONTAINER_ELEMENT_ID );

  // verify that all elements are present
  assert && assert( assertiveElement, 'No assertive element found in document' );
  assert && assert( politeElement, 'No polite element found in document' );
  assert && assert( alertContainer, 'No alert container element found in document' );

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
     * Announce an assertive alert.  This alert should be announced by the AT immediately, regardless of current user
     * interaction status.
     * @public
     *
     * @param {string} textContent - the alert to announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announceAssertive: function( textContent, withClear ) {
      updateLiveElement( assertiveElement, textContent, withClear );
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
      AriaHerald.clearAssertive();
      AriaHerald.clearPolite();
    },

    /**
     * Clear the text content from the assertive alert element. AT will not announce anything but this will prevent
     * content from being found in the document with the virtual cursor.
     * @public
     */
    clearAssertive: function() {
      assertiveElement.textContent = '';
    },

    /**
     * Clear the text content from the polite alert element.  AT will not announce anything but this will prevent
     * text content from being found in the document with the virtual cursor.
     * @public
     */
    clearPolite: function() {
      politeElement.textContent = '';
    },

    // static constants
    ASSERTIVE_ELEMENT_ID: ASSERTIVE_ELEMENT_ID,
    POLITE_ELEMENT_ID: POLITE_ELEMENT_ID,
    ALERT_CONTAINER_ELEMENT_ID: ALERT_CONTAINER_ELEMENT_ID
  };

  sceneryPhet.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );