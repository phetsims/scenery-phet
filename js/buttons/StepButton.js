// Copyright 2014-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Generalized button for stepping forward or back.  While this class is not private, clients will generally use the
 * convenience subclasses: StepForwardButton and StepBackwardButton
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../kite/js/imports.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import { HBox } from '../../../scenery/js/imports.js';
import { Path } from '../../../scenery/js/imports.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import stepForwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepForwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';

const DEFAULT_RADIUS = 20;
const marginCoefficient = 10.5 / DEFAULT_RADIUS;

class StepButton extends RoundPushButton {

  /**
   * @param {Object} [options] - see RoundPushButton
   */
  constructor( options ) {

    // these options are used in computation of other default options
    options = merge( {
      radius: DEFAULT_RADIUS,
      direction: 'forward' // {string} 'forward'|'backward'
    }, options );

    options = merge( {
      fireOnHold: true,
      iconFill: 'black',

      // shift the content to center align, assumes 3D appearance and specific content
      xContentOffset: ( options.direction === 'forward' ) ? ( 0.075 * options.radius ) : ( -0.15 * options.radius ),

      // use the step-forward sound by default
      soundPlayer: stepForwardSoundPlayer,

      // pdom
      innerContent: sceneryPhetStrings.a11y.stepButton.stepForward,
      appendDescription: true
    }, options );

    assert && assert( options.xMargin === undefined && options.yMargin === undefined, 'stepButton sets margins' );
    options.xMargin = options.yMargin = options.radius * marginCoefficient;

    assert && assert( options.direction === 'forward' || options.direction === 'backward',
      `unsupported direction: ${options.direction}` );

    // step icon is sized relative to the radius
    const BAR_WIDTH = options.radius * 0.15;
    const BAR_HEIGHT = options.radius * 0.9;
    const TRIANGLE_WIDTH = options.radius * 0.65;
    const TRIANGLE_HEIGHT = BAR_HEIGHT;

    // icon, in 'forward' orientation
    const barPath = new Rectangle( 0, 0, BAR_WIDTH, BAR_HEIGHT, { fill: options.iconFill } );
    const trianglePath = new Path( new Shape()
      .moveTo( 0, TRIANGLE_HEIGHT / 2 )
      .lineTo( TRIANGLE_WIDTH, 0 )
      .lineTo( 0, -TRIANGLE_HEIGHT / 2 )
      .close(), {
      fill: options.iconFill
    } );
    const stepIcon = new HBox( {
      children: [ barPath, trianglePath ],
      spacing: BAR_WIDTH,
      rotation: ( options.direction === 'forward' ) ? 0 : Math.PI
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = stepIcon;

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StepButton', this );
  }
}

sceneryPhet.register( 'StepButton', StepButton );
export default StepButton;