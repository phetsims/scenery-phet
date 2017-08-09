// Copyright 2002-2017, University of Colorado Boulder

/**
 * A static object used to send aria-live updates to the screen reader.  The herald simply references 'aria-live'
 * elements in the HTML document and updates their content. ARIA attributes specify the behavior of timing for the
 * alerts. The following alert elements must be in the HTML document, see
 * https://github.com/phetsims/chipper/issues/472.
 * These elements were tested and determined to be the most widely supported and most useful for PhET sims.
 *
 *    <p id="assertive" aria-live="assertive" aria-atomic="true"></p>
 *    <p id="polite" aria-live="polite" aria-atomic="true"></p>
 *    <p id="assertive-alert" aria-live="assertive" role="alert" aria-atomic="true"></p>
 *    <p id="polite-status" aria-live="polite" role="status" aria-atomic="true"></p>
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var Timer = require( 'PHET_CORE/Timer' );
  var TAriaHerald = require( 'SCENERY_PHET/accessibility/TAriaHerald' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // phet-io support
  var tandem = Tandem.createStaticTandem( 'ariaHerald' );

  // ids for each of the aria-live elements
  var ASSERTIVE_ELEMENT_ID = 'assertive';
  var POLITE_ELEMENT_ID = 'polite';
  var ASSERTIVE_ALERT_ELEMENT_ID = 'assertive-alert';
  var POLITE_STATUS_ELEMENT_ID = 'polite-status';
  var ALERT_CONTAINER_ELEMENT_ID = 'aria-live-elements';

  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  var DEFAULT_WITH_CLEAR = true;

  // DOM elements which will receive the updated content
  var assertiveElement = document.getElementById( ASSERTIVE_ELEMENT_ID );
  var politeElement = document.getElementById( POLITE_ELEMENT_ID );
  var assertiveAlertElement = document.getElementById( ASSERTIVE_ALERT_ELEMENT_ID );
  var politeStatusElement = document.getElementById( POLITE_STATUS_ELEMENT_ID );
  var alertContainer = document.getElementById( ALERT_CONTAINER_ELEMENT_ID );

  // verify that all elements are present
  assert && assert( assertiveElement, 'No assertive element found in document' );
  assert && assert( politeElement, 'No polite element found in document' );
  assert && assert( assertiveAlertElement, 'No assertive alert element found in document' );
  assert && assert( politeStatusElement, 'No polite status element found in document' );
  assert && assert( alertContainer, 'No alert container element found in document' );

  // associate a property with each live region - this is done in support of phet-io, otherwise the region values would
  // simply be set directly
  var assertiveElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'assertiveElementProperty' ),
    phetioValueType: TString,
    phetioInstanceDocumentation: 'This Property is read-only, do not attempt to set its value.'
  } );
  assertiveElementProperty.link( function( text ) {
    assertiveElement.textContent = text;
  } );
  var politeElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'politeElementProperty' ),
    phetioValueType: TString,
    phetioInstanceDocumentation: 'This Property is read-only, do not attempt to set its value.'
  } );
  politeElementProperty.link( function( text ) {
    politeElement.textContent = text;
  } );
  var assertiveAlertElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'assertiveAlertElementProperty' ),
    phetioValueType: TString,
    phetioInstanceDocumentation: 'This Property is read-only, do not attempt to set its value.'
  } );
  assertiveAlertElementProperty.link( function( text ) {
    assertiveAlertElement.textContent = text;
  } );
  var politeStatusElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'politeStatusElementProperty' ),
    phetioValueType: TString,
    phetioInstanceDocumentation: 'This Property is read-only, do not attempt to set its value.'
  } );
  politeStatusElementProperty.link( function( text ) {
    politeStatusElement.textContent = text;
  } );

  // Properties that indicate whether or not AriaHerald is enabled and visible. When disabled, no new alerts will
  // come through the screen reader.  When hidden, no alerts will come through, and the content will be hidden from 
  // the screen creader virtual cursor.  Properties are used primarily to support phet-io so that they can be observed.
  var alertsVisibleProperty = new Property( true, {
    tandem: tandem.createTandem( 'alertsVisibleProperty' ),
    phetioValueType: TBoolean
  } );
  var alertsEnabledProperty = new Property( true, {
    tandem: tandem.createTandem( 'alertsEnabledProperty' ),
    phetioValueType: TBoolean
  } );

  // Hide the container when alerts are not visible, hiding all of this content from the virtual cursor and preventing
  // alerts from coming through the assistive technology
  alertsVisibleProperty.link( function( visible ) {
    alertContainer.hidden = !visible;
  } );

  /**
   * Update an element with the 'aria-live' attribute by setting its text content.
   * If using withClear, old element text content will be explicitly removed before new text content is set.  This will
   * allow sequential alerts with identical text content to be announced multiple times in a row, which some screen
   * readers might have prevented.  Text content is only updated if the alerts are enabled.
   *
   * @param {HTMLElement} liveElement - the HTML element that will send the alert to the assistive technology
   * @param {Property.<string>} elementContentProperty - the property containing text content as a string
   * @param {string} textContent - the content to be announced
   * @param {boolean} [withClear] - optional, whether or not to remove the old text content before updating the element
   */
  function updateLiveElement( liveElement, elementContentProperty, textContent, withClear ) {
    withClear = ( withClear === undefined ) ? DEFAULT_WITH_CLEAR : withClear;
    assert && assert( typeof withClear === 'boolean', 'withClear must be of type boolean' );

    // only update content if the group of aria-live elements are enabled
    if ( alertsEnabledProperty.get() ) {

      // clearing the old content allows repeated alerts, but clear the HTMLElement content directly
      // so that we don't see the empty content in the PhET-iO data stream
      if ( withClear ) { liveElement.textContent = ''; }

      // update the content with a small delay - refresh rate of the accessibility tree is often slow, and without a
      // delay, many alerts would be lost forever
      Timer.setTimeout( function() { elementContentProperty.set( textContent ); }, 200 );
    }
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
      updateLiveElement( assertiveElement, assertiveElementProperty, textContent, withClear );
    },

    /**
     * Announce a polite alert.  This alert should be announced when the user has finished their current interaction or
     * after other utterances in the queue are finished.
     * @public
     *
     * @param {string} textContent - the polite content to announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announcePolite: function( textContent, withClear ) {
      updateLiveElement( politeElement, politeElementProperty, textContent, withClear );
    },

    /**
     * Announce an assertive alert, with ARIA alert behavior.  This behaves similarly to announceAssertive but AT will
     * add extra functionality with the alert role, such as literally saying 'Alert' or providing extra navigation
     * strategies to find this content.
     * @public
     *
     * @param  {string} textContent - the content ot announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announceAssertiveWithAlert: function( textContent, withClear ) {
      updateLiveElement( assertiveAlertElement, assertiveAlertElementProperty, textContent, withClear );
    },

    /**
     * Announce polite with ARIA status behavior.  This behaves similarly to announcePolite but AT will add extra
     * functionality with the status role, such as literally saying 'Status' or providing extra navigation strategies
     * to find this content.
     * @public
     *
     * @param {string} textContent - the content ot announce
     * @param {boolean} [withClear] - optional, whether or not to remove the old content from the alert before updating
     */
    announcePoliteWithStatus: function( textContent, withClear ) {
      updateLiveElement( politeStatusElement, politeStatusElementProperty, textContent, withClear );
    },

    /**
     * Clear all alerts by resetting text content with empty strings. A screen reader will not announce anything, but
     * this will remove all text content from the aria-live elements so that it cannot be found by the virtual cursor.
     * @public
     */
    clearAll: function() {
      assertiveElementProperty.reset();
      politeElementProperty.reset();
      assertiveAlertElementProperty.reset();
      politeStatusElementProperty.reset();
    },

    /**
     * Clear the text content from the assertive alert element. AT will not announce anything but this will prevent
     * content from being found in the document with the virtual cursor.
     * @public
     */
    clearAssertive: function() {
      assertiveElementProperty.reset();
    },

    /**
     * Clear the text content from the polite alert element.  AT will not announce anything but this will prevent
     * text content from being found in the document with the virtual cursor.
     * @public
     */
    clearPolite: function() {
      politeElementProperty.reset();
    },

    /**
     * Clear the text content from the assertive alert element.  AT will not announce anything but this will prevent
     * the text content from being found in the document with the virtual cursor.
     * @public
     */
    clearAssertiveWithAlert: function() {
      assertiveAlertElementProperty.reset();
    },

    /**
     * Clear the text content from the polite status element.  AT will not announce anything but this will prevent
     * the text content from being found in the document with the virtual cursor.
     * @public
     */
    clearPoliteWithStatus: function() {
      politeStatusElementProperty.reset();
    },

    /**
     * Completely hide or show the aria-live elements to screen readers. If hidden, all alerts will be 'invisible'
     * to a screen reader user, and alerts wil also be effectively disabled.
     */
    setVisible: function( visible ) {
      alertsVisibleProperty.set( visible );
    },
    set visible( visible ) { AriaHerald.setVisible( visible ); },

    /**
     * Get whether or not the elements associated with the AriaHerald are visible.  While not visible, all alerts
     * are disabled, screen readers will not announce any updates.
     * @public
     * @returns {boolean}
     */
    getVisible: function() {
      return alertsVisibleProperty.get();
    },
    get visible() { return alertsVisibleProperty.get(); },

    /**
     * Enable or disable all aria-live elements. When not enabled, the user will hear no alerts.
     * @public
     *
     * @param {boolean} enabled
     */
    setEnabled: function( enabled ) {
      this.clearAll();
      alertsEnabledProperty.set( enabled );
    },
    set enabled( enabled ) { AriaHerald.setEnabled( enabled ); },

    /**
     * Get whether or not all alerts are enabled.
     * @returns {boolean}
     */
    getEnabled: function() {
      return alertsEnabledProperty.get();
    },
    get enabled() { return AriaHerald.getEnabled(); },

    /**
     * Call the desired callback, first disabling all alerts. When the callback returns, enable alerts again.
     * @public
     *
     * @param {function} callback
     */
    callWithDisabledAlerts: function( callback ) {
      alertsEnabledProperty.set( false );
      callback();
      alertsEnabledProperty.set( true );
    },

    // static constants
    ASSERTIVE_ELEMENT_ID: ASSERTIVE_ELEMENT_ID,
    POLITE_ELEMENT_ID: POLITE_ELEMENT_ID,
    ASSERTIVE_ALERT_ELEMENT_ID: ASSERTIVE_ALERT_ELEMENT_ID,
    POLITE_STATUS_ELEMENT_ID: POLITE_STATUS_ELEMENT_ID,
    ALERT_CONTAINER_ELEMENT_ID: ALERT_CONTAINER_ELEMENT_ID
  };

  tandem.addInstance( AriaHerald, TAriaHerald );

  sceneryPhet.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );