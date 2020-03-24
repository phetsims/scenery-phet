// Copyright 2018-2020, University of Colorado Boulder

/**
 * A node that creates a summary of the screen in the PDOM. This type prevents duplicated code because
 * all screens have an instance of this node that is accessible on the ScreenView type.
 * Do not set the accessibleOrder of this Node, as it is ordered in its constructor to accept new children in the
 * proper place. TODO: Add assertions for this, see https://github.com/phetsims/joist/issues/511
 * USAGE: To add content to the screen overview in the PDOM, simply `this.screenSummaryNode.addChild( myNode() )` from
 * the ScreenView subtype, where myNode has accessible content to be displayed in the PDOM.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../scenery-phet-strings.js';

// constants
const screenSummaryMultiScreenIntroString = sceneryPhetStrings.a11y.simSection.screenSummaryMultiScreenIntro;
const screenSummaryKeyboardShortcutsHintString = sceneryPhetStrings.a11y.simSection.screenSummaryKeyboardShortcutsHint;
const screenSummarySingleScreenIntroPatternString = sceneryPhetStrings.a11y.simSection.screenSummarySingleScreenIntroPattern;

/**
 * @constructor
 */
function ScreenSummaryNode() {

  Node.call( this );

  // @private
  this.openingSummaryNode = new Node( { tagName: 'p' } );

  const keyboardShortcutsHint = new Node( {
    tagName: 'p',
    innerContent: screenSummaryKeyboardShortcutsHintString
  } );

  this.addChild( this.openingSummaryNode );
  this.addChild( keyboardShortcutsHint );

  // set the accessibleOrder so that the generic opening summary is first, and the keyboard shortcuts hint is last.
  this.accessibleOrder = [ this.openingSummaryNode, null, keyboardShortcutsHint ];
}

sceneryPhet.register( 'ScreenSummaryNode', ScreenSummaryNode );

export default inherit( Node, ScreenSummaryNode, {

  /**
   * The sim name and numberOfScreens in the simulation is not known in the constructor, so the intro string can
   * filled in later on during initialization.
   * @param {string} simName
   * @param {number} numberOfScreens
   * @public
   */
  setIntroString: function( simName, numberOfScreens ) {

    // different default string depending on if there are multiple screens
    this.openingSummaryNode.innerContent = numberOfScreens > 1 ? screenSummaryMultiScreenIntroString :
                                           StringUtils.fillIn( screenSummarySingleScreenIntroPatternString, {
                                             sim: simName
                                           } );
  }
} );