// Copyright 2018-2021, University of Colorado Boulder

/**
 * A node that creates a summary of the screen in the PDOM. This type prevents duplicated code because
 * all screens have an instance of this node that is accessible on the ScreenView type.
 * Do not set the pdomOrder of this Node, as it is ordered in its constructor to accept new children in the
 * proper place. TODO: Add assertions for this, see https://github.com/phetsims/joist/issues/511
 * USAGE: To add content to the screen overview in the PDOM, simply `this.screenSummaryNode.addChild( myNode() )` from
 * the ScreenView subtype, where myNode has accessible content to be displayed in the PDOM.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';

// constants
const screenSummaryMultiScreenIntroString = sceneryPhetStrings.a11y.simSection.screenSummary.multiScreenIntro;
const screenSummaryKeyboardShortcutsHintString = sceneryPhetStrings.a11y.simSection.screenSummary.keyboardShortcutsHint;
const screenSummarySingleScreenIntroPatternString = sceneryPhetStrings.a11y.simSection.screenSummary.singleScreenIntroPattern;

class ScreenSummaryNode extends Node {

  constructor() {

    super();

    // @private
    this.openingSummaryNode = new Node( { tagName: 'p' } );

    const keyboardShortcutsHint = new Node( {
      tagName: 'p',
      innerContent: screenSummaryKeyboardShortcutsHintString
    } );

    this.addChild( this.openingSummaryNode );
    this.addChild( keyboardShortcutsHint );

    // set the pdomOrder so that the generic opening summary is first, and the keyboard shortcuts hint is last.
    this.pdomOrder = [ this.openingSummaryNode, null, keyboardShortcutsHint ];
  }

  /**
   * The parameters are not known in the constructor, so the intro string can filled in later on during initialization.
   * @param {string} simName
   * @param {string} screenName - with the word "Screen" in it, like "Explore Screen"
   * @param {boolean} isMultiScreen - if the sim has multiple screens
   * @public
   */
  setIntroString( simName, screenName, isMultiScreen ) {

    // different default string depending on if there are multiple screens
    this.openingSummaryNode.innerContent = isMultiScreen ?
                                           StringUtils.fillIn( screenSummaryMultiScreenIntroString, { screen: screenName } ) :
                                           StringUtils.fillIn( screenSummarySingleScreenIntroPatternString, { sim: simName } );
  }
}

sceneryPhet.register( 'ScreenSummaryNode', ScreenSummaryNode );
export default ScreenSummaryNode;