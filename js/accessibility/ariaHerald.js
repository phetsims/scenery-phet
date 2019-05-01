// Copyright 2017-2019, University of Colorado Boulder

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
        validators: [ { valueType: 'string' } ]
      } );

      // no need to be removed, exists for the lifetime of the simulation.
      this.announcingEmitter.addListener( ( textContent ) => {
        const element = ariaLiveElements[ this.elementIndex ];
        this.updateLiveElement( element, textContent );

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
     */
    announcePolite( textContent ) {

      // or the default to support propper emitter typing
      this.announcingEmitter.emit( textContent );
    }

    /**
     * Update an element with the 'aria-live' attribute by setting its text content.
     *
     * @param {HTMLElement} liveElement - the HTML element that will send the alert to the assistive technology
     * @param {string} textContent - the content to be announced
     * @private
     */
    updateLiveElement( liveElement, textContent ) {

      // no-op if not initialized
      if ( !this.initialized ) {
        return;
      }

      // fully clear the old textContent so that sequential alerts with identical text will be announced, which
      // some screen readers might have prevented
      liveElement.textContent = '';

      // element must be visible for alerts to be spoken
      liveElement.hidden = false;

      // must be done asynchronously from setting hidden above or else the screen reader
      // will fail to read the content
      timer.setTimeout( () => {
        AccessibilityUtil.setTextContent( liveElement, textContent );

        // Hide the content so that it cant be read with the virtual cursor. Must be done
        // behind at least 200 ms delay or else alerts may be missed by NVDA and VoiceOver, see
        // https://github.com/phetsims/scenery-phet/issues/491
        timer.setTimeout( () => {

          // Using `hidden` rather than clearing textContent works better on mobile VO,
          // see https://github.com/phetsims/scenery-phet/issues/490
          liveElement.hidden = true;
        }, 200 );
      }, 0 );
    }
  }

  return sceneryPhet.register( 'ariaHerald', new AriaHerald() );
} );