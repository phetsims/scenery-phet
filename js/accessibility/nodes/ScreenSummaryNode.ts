// Copyright 2018-2022, University of Colorado Boulder

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
import { Node } from '../../../../scenery/js/imports.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';

export default class ScreenSummaryNode extends Node {

  private readonly openingSummaryNode: Node;

  public constructor() {

    super();

    this.openingSummaryNode = new Node( { tagName: 'p' } );

    const keyboardShortcutsHint = new Node( {
      tagName: 'p',
      innerContent: SceneryPhetStrings.a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty
    } );

    this.addChild( this.openingSummaryNode );
    this.addChild( keyboardShortcutsHint );

    // set the pdomOrder so that the generic opening summary is first, and the keyboard shortcuts hint is last.
    this.pdomOrder = [ this.openingSummaryNode, null, keyboardShortcutsHint ];
  }

  /**
   * The parameters are not known in the constructor, so the intro string can be filled after instantiation.
   * @param simName
   * @param screenDisplayName - with the word "Screen" in it, like "Explore Screen"
   * @param isMultiScreen - if the sim has multiple screens
   */
  public setIntroString( simName: string, screenDisplayName: string | null, isMultiScreen: boolean ): void {

    // different default string depending on if there are multiple screens
    this.openingSummaryNode.innerContent =
      ( isMultiScreen && screenDisplayName ) ?
      StringUtils.fillIn( SceneryPhetStrings.a11y.simSection.screenSummary.multiScreenIntroStringProperty, { screen: screenDisplayName } ) :
      StringUtils.fillIn( SceneryPhetStrings.a11y.simSection.screenSummary.singleScreenIntroPatternStringProperty, { sim: simName } );
  }
}

sceneryPhet.register( 'ScreenSummaryNode', ScreenSummaryNode );