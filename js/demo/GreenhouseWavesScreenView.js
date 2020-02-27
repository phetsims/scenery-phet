// Copyright 2020, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import Shape from '../../../kite/js/Shape.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../sun/js/Panel.js';
import NumberControl from '../NumberControl.js';
import sceneryPhet from '../sceneryPhet.js';

const amplitudeProperty = new NumberProperty( 100, {
  range: new Range( 1, 200 )
} );
const kProperty = new NumberProperty( 0.07, {
  range: new Range( 0.01, 0.2 )
} );
const wProperty = new NumberProperty( 6.9, {
  range: new Range( 0.1, 20 )
} );
const resolutionProperty = new NumberProperty( 2, {
  range: new Range( 2, 10 )
} );
const strokeProperty = new NumberProperty( 4, {
  range: new Range( 1, 10 )
} );

class Wave extends Path {
  constructor() {
    super( null, {
      stroke: 'yellow',
      lineWidth: 4
    } );
    this.t = 0;
    this.step( 0 );

    strokeProperty.link( s => {
      this.lineWidth = s;
    } );
  }

  step( dt ) {
    const s = new Shape();
    this.t += dt;
    const phi = 0;
    const dx = resolutionProperty.value;

    const START = 0;

    if ( this.visible ) {

      for ( let x = START; x < 800; x += dx ) {
        const y = amplitudeProperty.value * Math.cos( kProperty.value * x - wProperty.value * this.t + phi );

        if ( this.t * 100 > x ) {
          if ( x === START ) {
            s.moveTo( y, x );
          }
          else {
            s.lineTo( y, x );
          }
        }
      }
      this.shape = s;
    }
  }
}


class GreenhouseWavesScreenView extends ScreenView {
  constructor( model ) {
    super();
    this.waves = [];
    const MAX_WAVES = 10;
    for ( let i = 0; i < MAX_WAVES; i++ ) {
      this.waves.push( new Wave() );
    }

    this.waves.forEach( wave => this.addChild( wave ) );
    const e = this.layoutBounds.eroded( 50 );

    const numberWavesProperty = new Property( 2 );
    numberWavesProperty.link( numberWaves => {
      this.waves.forEach( ( wave, waveIndex ) => {
        wave.setVisible( waveIndex < numberWaves );

        const spaces = numberWaves + 1;
        const spacing = e.width / spaces;
        if ( numberWaves === 1 ) {
          wave.x = e.centerX;
        }
        else {
          wave.x = e.minX + spacing * ( waveIndex + 1 );
        }
      } );
    } );

    this.addChild( new Rectangle( 0, 0, 5000, 5000, {
      fill: '#4EAE1E',
      centerTop: this.layoutBounds.center.plusXY( 0, 200 )
    } ) );

    const SCALE = 0.6;


    const panel = new Panel( new HBox( {
      children: [
        new NumberControl( '# waves', numberWavesProperty, new Range( 1, MAX_WAVES ), {
          scale: SCALE
        } ),
        new NumberControl( 'amplitude', amplitudeProperty, amplitudeProperty.range, {
          scale: SCALE
        } ),
        new NumberControl( 'k', kProperty, kProperty.range, {
          scale: SCALE,
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ),
        new NumberControl( 'w', wProperty, wProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ), new NumberControl( 'res', resolutionProperty, resolutionProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ), new NumberControl( 'stroke', strokeProperty, strokeProperty.range, {
          scale: SCALE,
          delta: 0.5,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } )

      ]
    } ), {
      centerBottom: this.layoutBounds.centerBottom
    } );
    this.addChild( panel );
    this.addChild( new RectangularPushButton( {
      content: new Text( 'Reset time' ),
      rightBottom: panel.rightTop,
      listener: () => {
        this.waves.forEach( w => {
          w.t = 0;
        } );
      }
    } ) );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
  }
}

sceneryPhet.register( 'GreenhouseWavesScreenView', GreenhouseWavesScreenView );

export default GreenhouseWavesScreenView;