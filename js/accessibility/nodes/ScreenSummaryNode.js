// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a summary of the screen in the PDOM. This type prevents duplicated code because
 * all screens have an instance of this node that is accessible on the ScreenView type.
 * Node do not set the accessibleOrder of this Node, as it is ordered in its constructor to accept new children in
 * the proper place.
 * USAGE: To add content to the screen overview in the PDOM, simply `this.screenSummaryNode.addChild( myNode() )` from
 * the ScreenView subtype, where myNode has accessible content to be displayed in the PDOM.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // a11y strings
  var sceneSummaryMultiScreenIntroString = SceneryPhetA11yStrings.sceneSummaryMultiScreenIntro.value;
  var screenSummarySingleScreenIntroPatternString = SceneryPhetA11yStrings.screenSummarySingleScreenIntroPattern.value;
  var screenSummaryKeyboardShortcutsHintString = SceneryPhetA11yStrings.screenSummaryKeyboardShortcutsHint.value;

  /**
   * @constructor
   */
  function ScreenSummaryNode() {

    Node.call( this );

    // @private
    this.openingSummaryNode = new Node( { tagName: 'p' } );

    var keyboardShortcutsHint = new Node( {
      tagName: 'p',
      innerContent: screenSummaryKeyboardShortcutsHintString
    } );

    // create the overview node and add it to the scene graph
    this.addChild( this.openingSummaryNode );
    this.addChild( keyboardShortcutsHint );

    // set the accessibleOrder so that the generic opening summary is first, and the keyboard shortcuts hint is last.
    this.accessibleOrder = [ this.openingSummaryNode, null, keyboardShortcutsHint ];
  }

  sceneryPhet.register( 'ScreenSummaryNode', ScreenSummaryNode );

  return inherit( Node, ScreenSummaryNode, {

    /**
     * The sim name and numberOfScreens in the simulation is not known in the constructor, so the intro string can filled
     * in later on during initialization.
     * @param {string} simName
     * @param {number} numberOfScreens
     */
    setIntroString: function( simName, numberOfScreens ) {

      // different default string depending on if there are multiple screens
      this.openingSummaryNode.innerContent = numberOfScreens > 1 ? sceneSummaryMultiScreenIntroString :
                                             StringUtils.fillIn( screenSummarySingleScreenIntroPatternString, {
                                               sim: simName
                                             } );
    }
  } );
} );
