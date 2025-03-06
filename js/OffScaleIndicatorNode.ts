// Copyright 2024-2025, University of Colorado Boulder

/**
 * An indicator that shows when something is off scale - usually in the context of a plot.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import ReadingBlock, { ReadingBlockOptions } from '../../scenery/js/accessibility/voicing/ReadingBlock.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../scenery/js/nodes/RichText.js';
import Panel, { PanelOptions } from '../../sun/js/Panel.js';
import ArrowNode, { ArrowNodeOptions } from './ArrowNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { TrimParallelDOMOptions } from '../../scenery/js/accessibility/pdom/ParallelDOM.js';

type SelfOptions = {

  // The label string for the off scale indicator.
  offScaleStringProperty?: TReadOnlyProperty<string>;

  // The length of the arrow icon tail.
  arrowTailLength?: number;

  // Spacing between the label text and the icon arrow.
  spacing?: number;

  // Options forwarded to the ArrowNode.
  arrowNodeOptions?: ArrowNodeOptions;

  // Options forwarded to the RichText label.
  richTextOptions?: RichTextOptions;

  // Options forwarded to the Panel.
  panelOptions?: PanelOptions;
};

// Use accessibleParagraph for accessibility on this component.
type ParentOptions = ReadingBlockOptions & StrictOmit<TrimParallelDOMOptions<NodeOptions>, 'accessibleName' | 'accessibleHelpText'>;

export type OffScaleIndicatorNodeOptions = SelfOptions & ParentOptions;

export default class OffScaleIndicatorNode extends ReadingBlock( Node ) {
  private readonly richText: RichText;

  public constructor( direction: 'left' | 'right' | 'up' | 'down', providedOptions?: OffScaleIndicatorNodeOptions ) {
    const options = optionize<OffScaleIndicatorNodeOptions, SelfOptions, ParentOptions>()( {
      offScaleStringProperty: SceneryPhetStrings.offScaleIndicator.pointsOffScaleStringProperty,
      arrowTailLength: 25,
      spacing: 5,
      arrowNodeOptions: {
        tailWidth: 2
      },
      richTextOptions: {
        font: new PhetFont( 14 ),
        maxWidth: 100,
        maxHeight: 50,
        align: 'left'
      },
      panelOptions: {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 3
      }
    }, providedOptions );

    // If an accessible paragraph is not provided, use a default one that describes the direction.
    if ( !options.accessibleParagraph ) {
      options.accessibleParagraph = OffScaleIndicatorNode.getAccessibleParagraphForDirection( direction );
    }

    // By default, the reading block name response is the same as the accessible paragraph.
    if ( !options.readingBlockNameResponse ) {
      options.readingBlockNameResponse = options.accessibleParagraph;
    }

    const richText = new RichText( options.offScaleStringProperty, options.richTextOptions );

    const x2 = direction === 'right' ? options.arrowTailLength :
               direction === 'left' ? -options.arrowTailLength :
               0;
    const y2 = direction === 'down' ? options.arrowTailLength :
               direction === 'up' ? -options.arrowTailLength :
               0;
    const arrowNode = new ArrowNode( 0, 0, x2, y2, options.arrowNodeOptions );

    const panelContent = new HBox( {

      // For all directions except right, the arrow should be on the left side of the text.
      children: direction === 'right' ? [ richText, arrowNode ] : [ arrowNode, richText ],
      spacing: options.spacing
    } );

    const panel = new Panel( panelContent, options.panelOptions );

    super( options );
    this.addChild( panel );

    this.richText = richText;
  }

  public override dispose(): void {
    this.richText.dispose();
    super.dispose();
  }

  private static getAccessibleParagraphForDirection( direction: 'left' | 'right' | 'up' | 'down' ): TReadOnlyProperty<string> {
    return direction === 'right' ? SceneryPhetStrings.a11y.offScaleIndicator.pointsOffScaleRightStringProperty :
           direction === 'left' ? SceneryPhetStrings.a11y.offScaleIndicator.pointsOffScaleLeftStringProperty :
           direction === 'up' ? SceneryPhetStrings.a11y.offScaleIndicator.pointsOffScaleUpStringProperty :
           SceneryPhetStrings.a11y.offScaleIndicator.pointsOffScaleDownStringProperty;
  }
}

sceneryPhet.register( 'OffScaleIndicatorNode', OffScaleIndicatorNode );