// Copyright 2017-2018, University of Colorado Boulder

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
 * NOTE: ariaHerald needs to be initialized before use as a singleton.
 * As of this writing (Nov 2017) this initialization occurs in Sim.js. Therefore if something uses ariaHerald
 * before Sim.js has initialized this file, the result will be a silent no-op.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( require => {
  'use strict';

  // modules
  const AccessibilityUtil = require( 'SCENERY/accessibility/AccessibilityUtil' );
  const Emitter = require( 'AXON/Emitter' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const timer = require( 'AXON/timer' );

  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  const DEFAULT_WITH_CLEAR = true;

  // DOM elements which will receive the updated content. By having four elements and cycling through each one, we
  // can get around a VoiceOver bug where a new alert would interrupt the previous alert if it wasn't finished
  // speaking, see https://github.com/phetsims/scenery-phet/issues/362
  const politeElement1 = document.getElementById( 'polite-1' );
  const politeElement2 = document.getElementById( 'polite-2' );
  const politeElement3 = document.getElementById( 'polite-3' );
  const politeElement4 = document.getElementById( 'polite-4' );
  const ariaLiveElements = [ politeElement1, politeElement2, politeElement3, politeElement4 ];

  class AriaHerald {

    constructor() {
      // {boolean} - whether or not this instance has been initialized or not
      this.initialized = false;

      // index of current aria-live element to use, updated every time an event triggers
      this.elementIndex = 0;

      // @public {null|Emitter} - set in initialize method. Emit whenever we announce.
      this.announcingEmitter = null;
    }

    /**
     * Initialize AriaHerald to allow usage of its features. If not initialized, then it will no-op. This allows
     * AriaHerald to be disabled completely if a11y is not enabled.
     */
    initialize() {

      // verify that all DOM elements with aria-live are in the document
      assert && assert( document.getElementById( 'aria-live-elements' ), 'No alert container element found in document' );
      assert && assert( politeElement1, 'aria-live element 1 missing from document, all are required' );
      assert && assert( politeElement2, 'aria-live element 2 missing from document, all are required' );
      assert && assert( politeElement3, 'aria-live element 3 missing from document, all are required' );
      assert && assert( politeElement4, 'aria-live element 4 missing from document, all are required' );

      this.initialized = true;

      this.announcingEmitter = new Emitter( {
        argumentTypes: [ { valueType: 'string' }, { valueType: 'boolean' } ]
      } );

      // no need to be removed, exists for the lifetime of the simulation.
      this.announcingEmitter.addListener( ( textContent, withClear ) => {
        const element = ariaLiveElements[ this.elementIndex ];
        this.updateLiveElement( element, textContent, withClear );

        // update index for next time
        this.elementIndex = ( this.elementIndex + 1 ) % ariaLiveElements.length;
      } );
    }

    /**
     * Announce a polite alert.  This alert should be announced when the user has finished their current interaction or
     * after other utterances in the screen reader's queue are finished.
     * @public
     *
     * @param {string} textContent - the polite content to announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announcePolite( textContent, withClear ) {

      // or the default to support propper emitter typing
      this.announcingEmitter.emit( textContent, withClear || DEFAULT_WITH_CLEAR );
    }

    /**
     * Update an element with the 'aria-live' attribute by setting its text content.
     * If using withClear, old element text content will be explicitly removed before new text content is set.  This will
     * allow sequential alerts with identical text content to be announced multiple times in a row, which some screen
     * readers might have prevented.
     *
     * @param {HTMLElement} liveElement - the HTML element that will send the alert to the assistive technology
     * @param {string} textContent - the content to be announced
     * @param {boolean} [withClear] - optional, whether or not to remove the old text content before updating the element
     * @private
     */
    updateLiveElement( liveElement, textContent, withClear ) {

      // no-op if not initialized
      if ( !this.initialized ) {
        return;
      }

      withClear = ( withClear === undefined ) ? DEFAULT_WITH_CLEAR : withClear;
      assert && assert( typeof withClear === 'boolean', 'withClear must be of type boolean' );

      // clearing the old content allows repeated alerts
      if ( withClear ) { liveElement.textContent = ''; }

      AccessibilityUtil.setTextContent( liveElement, textContent );

      // after a small delay, remove this alert content from the DOM so that it cannot be found again - must occur
      // after a delay for screen reader to register the change in text content
      timer.setTimeout( () => { liveElement.textContent = ''; }, 200 );
    }
  }

  return sceneryPhet.register( 'ariaHerald', new AriaHerald() );
} );