// Copyright 2022, University of Colorado Boulder

/**
 * A Node that produces a variety of outputs to provide a mechanism to synchronize anything that may be recording from these.
 * This includes sound, visuals, and the PhET-iO data stream.
 *
 * TODO: Instrument for PhET-iO, https://github.com/phetsims/scenery-phet/issues/739
 * TODO: Emit a PhET-iO state when triggered, https://github.com/phetsims/scenery-phet/issues/739
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize, { assignOptions } from '../../phet-core/js/optionize.js';
import PitchedPopGenerator from '../../tambo/js/sound-generators/PitchedPopGenerator.js';
import videoSolidShape from '../../sherpa/js/fontawesome-5/videoSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import sceneryPhet from './sceneryPhet.js';
import { Node, NodeOptions, Path, RichText } from '../../scenery/js/imports.js';
import soundManager from '../../tambo/js/soundManager.js';
import BackgroundNode from './BackgroundNode.js';
import stepTimer from '../../axon/js/stepTimer.js';
import Tandem from '../../tandem/js/Tandem.js';

type SelfOptions = {
  visualNode?: Node;
  synchronizeButtonOptions?: Omit<RectangularPushButtonOptions, 'listener' | 'tandem'>;
}

type ClapperboardButtonOptions = SelfOptions & NodeOptions;

class ClapperboardButton extends Node {
  constructor( providedOptions?: ClapperboardButtonOptions ) {

    const x = new PitchedPopGenerator();
    soundManager.addSoundGenerator( x );

    const options = optionize<ClapperboardButtonOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      visualNode: new BackgroundNode( new Path( videoSolidShape, { scale: 4, fill: 'red' } ), {
        xMargin: 20,
        yMargin: 20,
        rectangleOptions: {
          fill: 'black',
          opacity: 1
        }
      } ),
      synchronizeButtonOptions: {
        content: new RichText( 'Synchronize Recording' ),
        soundPlayer: {
          play: () => {
            x.playPop( 1 );
          },
          stop: _.noop
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    const synchronizeButton = new RectangularPushButton( assignOptions<RectangularPushButtonOptions>( {
      listener: () => {
        this.addChild( options.visualNode );
        stepTimer.setTimeout( () => {
          this.removeChild( options.visualNode );
          this.visible = false;
        }, 1000 ); // TODO: how long to wait? https://github.com/phetsims/scenery-phet/issues/739
      },
      tandem: options.tandem.createTandem( 'synchronizeButton' )
    }, options.synchronizeButtonOptions ) );
    this.addChild( synchronizeButton );
  }
}

sceneryPhet.register( 'ClapperboardButton', ClapperboardButton );

export default ClapperboardButton;