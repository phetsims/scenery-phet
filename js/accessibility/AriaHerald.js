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
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Property = require( 'AXON/Property' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // phet-io support
  var tandem = Tandem.createStaticTandem( 'AriaHerald' );

  // constants
  var disabled = false; // flag that enables/disables alerts via AriaHerald
  
  // by default, clear old text so sequential updates with identical text are announced, see updateLiveElement()
  var DEFAULT_WITH_CLEAR = true;

  // DOM elements which will receive the updated content
  var assertiveElement = document.getElementById( 'assertive' );
  var politeElement = document.getElementById( 'polite' );
  var assertiveAlertElement = document.getElementById( 'assertive-alert' );
  var politeStatusElement = document.getElementById( 'polite-status' );
  var alertContainer = document.getElementById( 'aria-live-elements' );

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
    phetioValueType: TString
  } );
  assertiveElementProperty.link( function( text ) {
    assertiveElement.textContent = text;
  } );
  var politeElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'politeElementProperty' ),
    phetioValueType: TString
  } );
  politeElementProperty.link( function( text ) {
    politeElement.textContent = text;
  } );
  var assertiveAlertElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'assertiveAlertElementProperty' ),
    phetioValueType: TString
  } );
  assertiveAlertElementProperty.link( function( text ) {
    assertiveAlertElement.textContent = text;
  } );
  var politeStatusElementProperty = new Property( '', {
    tandem: tandem.createTandem( 'politeStatusElementProperty' ),
    phetioValueType: TString
  } );
  politeStatusElementProperty.link( function( text ) {
    politeStatusElement.textContent = text;
  } );

  /**
   * Update an element with the 'aria-live' attribute by setting its text content.
   * If using withClear, old element text content will be explicitly removed before new text content is set.  This will
   * allow sequential alerts with identical text content to be announced multiple times in a row, which some screen
   * readers might have prevented.  Text content is only updated if the alerts are enabled.
   * 
   * @param {Property.<string>} elementContentProperty - the property containing text content as a string
   * @param {string} textContent - the content to be announced
   * @param {boolean} [withClear] - optional, whether or not to remove the old text content before updating the element
   */
  function updateLiveElement( elementContentProperty, textContent, withClear ) {
    withClear = ( withClear === 'undefined' ) ? DEFAULT_WITH_CLEAR : withClear;
    assert && assert( typeof withClear === 'boolean', 'withClear must be of type boolean' );

    // only update content if the group of aria-live elements are enabled
    if ( !disabled ) {
      if ( withClear ) { elementContentProperty.reset(); }
      elementContentProperty.set( textContent );
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
      updateLiveElement( assertiveElementProperty, textContent, withClear );
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
      updateLiveElement( politeElementProperty, textContent, withClear );
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
      updateLiveElement( assertiveAlertElementProperty, textContent, withClear );
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
      updateLiveElement( politeStatusElementProperty, textContent, withClear );
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
     * Disables or enable all aria-live elements. When disabled, the user will hear no alerts.
     * @param {Boolean} isDisabled
     */
    setDisabled: function( isDisabled ) {
      disabled = isDisabled;
    }
  };

  sceneryPhet.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );