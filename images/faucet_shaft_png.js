/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAWCAIAAACuSD4AAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGhJREFUeNrs0rENwDAIAMHEpHFjiY1ZGaiRMkIaCjv6H+H0t5ld1NEz50Shh1JVUYASSijpg3KthUIPpYigAOVmlGMMFKDcjLKqUOihzEwUeigjAgUoofwrpbujwJVQQklQQnlarwADAKkHIlinYFEVAAAAAElFTkSuQmCC';
export default image;