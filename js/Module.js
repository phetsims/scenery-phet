/**
 * When creating a Sim, Modules are supplied as the arguments.  They can be specified as object literals or through instances of this class.
 * This class may centralize default behavior or state for Modules in the future, but right now it only allows you to create
 * Sims without using named parameter object literals.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  function Module( name, icon, createModel, createView ) {
    this.name = name;
    this.icon = icon;
    this.createModel = createModel;
    this.createView = createView;
  }

  return Module;
} );