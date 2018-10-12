// Copyright 2017, University of Colorado Boulder

/**
 * A static object used to send aria-live updates to a screen reader. These are alerts that are independent of user
 * focus. This will simply reference 'aria-live' elements in the HTML document and update their content. ARIA
 * attributes specify the behavior of timing for the alerts. The following HTML elements must be in the document
 *
 *    <p id="polite-1" aria-live="polite"></p>
 *    <p id="polite-2" aria-live="polite"></p>
 *    <p id="polite-3" aria-live="polite"></p>
 *    <p id="polite-4" aria-live="polite"></p>
 *
 * It was discovered that cycling through these alerts prevented a VoiceOver bug where alerts would interrupt each
 * other. Starting from the first element, content is set on each element in order and cycles through.
 *
 * It is a commonly known (but not specified) limitation that aria-live elements must exist in the document before
 * the page has finished loading  to work with screen readers. Screen readers do not add observers to aria-live
 * elements that are added to the document after page load. So these elements must exist in the document before the
 * `onload` event triggers.
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
  var timer = require( 'PHET_CORE/timer' );

  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  var DEFAULT_WITH_CLEAR = true;

  // If not initialized, then AriaHerald will no-op for all functionality
  var initialized = false;

  // DOM elements which will receive the updated content. By having four elements and cycling through each one, we
  // can get around a VoiceOver bug where a new alert would interrupt the previous alert if it wasn't finished
  // speaking, see https://github.com/phetsims/scenery-phet/issues/362
  var politeElement1 = document.getElementById( 'polite-1' );
  var politeElement2 = document.getElementById( 'polite-2' );
  var politeElement3 = document.getElementById( 'polite-3' );
  var politeElement4 = document.getElementById( 'polite-4' );
  var ariaLiveElements = [ politeElement1, politeElement2, politeElement3, politeElement4 ];

  // index of current aria-live element to use, updated every time an event triggers
  var elementIndex = 0;

  // verify that all elements are in the document
  assert && assert( document.getElementById( 'aria-live-elements' ), 'No alert container element found in document' );
  assert && assert( politeElement1, 'aria-live element 1 missing from document, all are required' );
  assert && assert( politeElement2, 'aria-live element 2 missing from document, all are required' );
  assert && assert( politeElement3, 'aria-live element 3 missing from document, all are required' );
  assert && assert( politeElement4, 'aria-live element 4 missing from document, all are required' );

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
    timer.setTimeout( function() { liveElement.textContent = ''; }, 200 );
  }

  // {function|null} - used in testing to get a callback whenever we get an alert.
  // NOTE: for testing only, see UtteranceTests.js
  var testingBackDoorCallback = null;

  /**
   * Static object that provides the functions for updating the aria-live regions for screen reader announcements.
   */
  var AriaHerald = {

    /**
     * Initialize AriaHerald to allow usage of its features. If not initialized, then it will no-op. This allows
     * AriaHerald to be disabled completely if a11y is not enabled.
     * @param {function} [_testingBackDoorCallback] - used to get a callback whenever text is put on an aria live element
     */
    initialize: function( _testingBackDoorCallback ) {
      assert && assert( _testingBackDoorCallback === undefined || typeof _testingBackDoorCallback === 'function' );
      testingBackDoorCallback = _testingBackDoorCallback;
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
      var element = ariaLiveElements[ elementIndex ];
      updateLiveElement( element, textContent, withClear );

      // in addition to setting the alert on the aria-live attribute, call a listener with the alert text, as a backdoor for testing
      testingBackDoorCallback && testingBackDoorCallback( textContent );

      // update index for next time
      elementIndex = ( elementIndex + 1 ) % ariaLiveElements.length;
    }
  };

  sceneryPhet.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );