/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAArCAIAAACGv1O8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNrsz0EKgCAQQNExu5/3P4tihUGLqGgbvb+QGZnNm0spOed5tA+X65ubu/XhbCultIwi4uE9rb331lqttY2O4f1njKb4d/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/PxfaxVgAJiOYdlhdQCAAAAAAElFTkSuQmCC';
export default image;