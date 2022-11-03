// Copyright 2017-2022, University of Colorado Boulder

/**
 * KeyNode looks like a keyboard key. It has a shadow rectangle under the key icon, with a slight offset so that it
 * has a 3D appearance.  KeyNodes are primarily used for accessibility to provide extra information about keyboard
 * navigation and functionality, but an icon could be used for any purpose.
 *
 * Each KeyNode has the same height by default, and icon will be scaled down if it is too large to maintain the proper
 * key height. The width will expand based on padding and the width of the icon in order to surround content fully.
 *
 * @author Jesse Greenberg
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { AlignBox, Node, NodeOptions, Rectangle, TColor } from '../../../scenery/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';

type XAlign = 'left' | 'center' | 'right';
type YAlign = 'top' | 'center' | 'bottom';

// All widths, offsets, and height values are in the ScreenView coordinate frame.
type SelfOptions = {

  // color and styling
  keyFill?: TColor;
  keyShadowFill?: TColor;
  lineWidth?: number; // line width for the key icon
  cornerRadius?: number; // corner radius applied to the key and its shadow

  // offset for the shadow rectangle relative to the top left corner of the key
  xShadowOffset?: number;
  yShadowOffset?: number;

  // margins set by AlignBox
  xMargin?: number; // sets the horizontal margin for the icon from the left/right edge
  yMargin?: number; // set the vertical margin for the icon from the top/botton edges

  // icon aligned in center of key by default
  xAlign?: XAlign;
  yAlign?: YAlign;

  // x and y padding around the icon, will increase the size of the key if there is available space,
  // or scale down the icon if key is at max width or height
  xPadding?: number;
  yPadding?: number;

  // Key will be at least this wide, making it possible to surround the icon with extra space if necessary.
  // The minimum width of the KeyNode allowed, if the icon is wider, than it will expand gracefully
  minKeyWidth?: number;

  // the desired height of the KeyNode; icon will be scaled down if too big
  keyHeight?: number;

  // Force the width of the KeyNode to be the same width as height, based on the height.
  // Will scale down the icon if too wide.
  forceSquareKey?: boolean;
};

export type KeyNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class KeyNode extends Node {

  public constructor( keyIcon: Node, providedOptions?: KeyNodeOptions ) {

    const options = optionize<KeyNodeOptions, SelfOptions, NodeOptions>()( {
      keyFill: 'white',
      keyShadowFill: 'black',
      lineWidth: 1.3,
      cornerRadius: 2,
      xShadowOffset: 1.7,
      yShadowOffset: 1.7,
      xMargin: 0,
      yMargin: 0,
      xAlign: 'center',
      yAlign: 'center',
      xPadding: 4,
      yPadding: 4,
      keyHeight: 23,
      minKeyWidth: 23, // default equal to keyHeight, a square key as the minimum.
      forceSquareKey: false
    }, providedOptions );

    // Add the height scale to a new node based on the height, with keyIcon as a child so that we don't mutate the parameter node.
    const heightScaleNode = new Node( { children: [ keyIcon ] } );

    // Add the scale to a new node based on the width
    const widthScaleNode = new Node( { children: [ heightScaleNode ] } );

    // place content in an align box so that the key surrounding the icon has minimum bounds calculated above
    // with support for margins
    const content = new AlignBox( widthScaleNode, {
      xAlign: options.xAlign,
      yAlign: options.yAlign,
      xMargin: options.xMargin,
      yMargin: options.yMargin
    } );

    // background (shadow rectangle)
    const backgroundShadow = new Rectangle( 0, 0, 1, 1, options.cornerRadius, options.cornerRadius, {
      fill: options.keyShadowFill
    } );

    // foreground
    const whiteForeground = new Rectangle( 0, 0, 1, 1, options.cornerRadius, options.cornerRadius, {
      fill: options.keyFill,
      stroke: 'black',
      lineWidth: options.lineWidth
    } );

    keyIcon.boundsProperty.link( () => {

      // scale down the size of the keyIcon passed in if it is taller than the max height of the icon
      let heightScalar = 1;
      const availableHeightForKeyIcon = options.keyHeight - options.yPadding; // adjust for the vertical margin
      if ( keyIcon.height > availableHeightForKeyIcon ) {
        heightScalar = availableHeightForKeyIcon / keyIcon.height;
      }

      heightScaleNode.setScaleMagnitude( heightScalar );

      // Set the keyWidth to either be the minimum, or the width of the icon + padding, which ever is larger.
      let keyWidth = Math.max( options.minKeyWidth, heightScaleNode.width + options.xPadding );

      // Make the width the same as the height by scaling down the icon if necessary
      if ( options.forceSquareKey ) {

        // If we are forcing square, we may have to scale the node down to fit
        const availableWidthForKeyIcon = options.minKeyWidth - options.xPadding; // adjust for the horizontal margin

        let widthScalar = 1;
        if ( keyIcon.width > availableWidthForKeyIcon ) {
          widthScalar = availableWidthForKeyIcon / keyIcon.width;
        }

        // Set the width to the height to make sure the alignBounds below are set correctly as a square.
        keyWidth = options.keyHeight;

        widthScaleNode.setScaleMagnitude( widthScalar );
      }

      content.setAlignBounds( new Bounds2( 0, 0, keyWidth, options.keyHeight ) );
      backgroundShadow.setRectBounds( content.bounds.shiftedXY(
        options.xShadowOffset, options.yShadowOffset ) );
      whiteForeground.setRectBounds( content.bounds );
    } );

    // children of the icon node, including the background shadow, foreground key, and content icon
    options.children = [

      backgroundShadow,
      whiteForeground,

      // content on top
      content
    ];

    super( options );
  }
}

sceneryPhet.register( 'KeyNode', KeyNode );