// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a "Scene Summary" accessible section in the pDOM. This type prevents duplicated code because
 * all scene summaries have the same label, structure, and intro sentence.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // a11y strings
  var sceneSummaryMultiScreenIntroString = SceneryPhetA11yStrings.sceneSummaryMultiScreenIntro.value;
  var sceneSummarySingleScreenIntroString = SceneryPhetA11yStrings.sceneSummarySingleScreenIntro.value;
  var sceneSummaryString = SceneryPhetA11yStrings.sceneSummary.value;

  /**
   * @constructor
   * @param {string} sceneSummary - the text for the sim specific part of the intro paragraph
   * @param {Object} options
   */
  function SceneSummaryNode( sceneSummary, options ) {
    assert && assert( sceneSummary && typeof sceneSummary === 'string', 'SceneSummaryNode must have a scene summary' );

    // options for accessibility, but others can be passed to Node call
    options = _.extend( {
      content: new Node(), // {Node} content - to be added after to main paragraph of the scene summary
      multiscreen: true // to use the default multiscreen intro or single screen intro
    }, options );

    AccessibleSectionNode.call( this, sceneSummaryString, options );


    // different default string depending on if there are multiple screens
    var introString = options.multiscreen ? sceneSummaryMultiScreenIntroString : sceneSummarySingleScreenIntroString;
    var openingSummaryNode = new Node( { tagName: 'p', accessibleLabel: introString + sceneSummary } );
    this.addChild( openingSummaryNode );

    this.addChild( options.content );
  }

  sceneryPhet.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode );
} );
