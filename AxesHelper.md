# AxesHelper.

An axis object to visualize the 1, 2 or 3 axes.

## Quick start

### AxesHelper.

The easiest way to use AxesHelper in your code is import AxesHelper from AxesHelper.js file in your JavaScript module.
[Example](https://github.com/anhr/AxesHelper/blob/master/Examples/AxesHelper.html).
```
import { AxesHelper } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelper.js';
```
or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://github.com/anhr/AxesHelper/blob/master/Examples/AxesHelper.html) web page.
* import [three.js](https://github.com/anhr/three.js)
```
import * as THREE from 'https://threejs.org/build/three.module.js';
```
or
```
import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
```
or download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
```
import * as THREE from './three.js/dev/build/three.module.js';
```
* Download [AxesHelper](https://github.com/anhr/AxesHelper) repository into your "[folderName]\AxesHelper\master" folder.
```
import { AxesHelper } from './AxesHelper/master/AxesHelper.js';
```

Now you can use AxesHelper in your javascript code.

The simplest AxesHelper has at least one axis.
```
new AxesHelper( THREE, scene, { scales: { x: {} } } );
```

Now we want to create AxesHelper 3 dimensional axes.

Name of the X is 'time'. Number of X scale marks is 5.

Minimum Y is 0.
Please edit line above for it.
```
new AxesHelper( THREE, scene, {

	scales: {

		x: {
		
			name: 'time',
			marks: 5
		
		},
		y: {
		
			min: 0,
		
		},
		z: {}

	}

} );
```
Currently the z axis is exists but not visible. Move camera for resolving of issue.
```
camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );
camera.rotation.set( -0.1973955598498808, 0.19365830044432672, 0.03847102740732835 );
```
You can use the [THREE.OrbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) to rotate the camera.

Import OrbitControls,
```
import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
```
and edit your code
```
//camera.rotation.set( -0.1973955598498808, 0.19365830044432672, 0.03847102740732835 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
controls.update();
```

See "Raycaster" list item if the [StereoEffect](../../../commonNodeJS/master/StereoEffect/jsdoc)

### AxesHelperGui

Add AxesHelperGui into [dat.gui](https://github.com/anhr/dat.gui) for manual change settings of the AxesHelper.
[Example](https://raw.githack.com/anhr/AxesHelper/master/Examples/AxesHelperGui.html)

Import dat.gui.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Import AxesHelperGui.
```
import { AxesHelperGui } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelperGui.js';
```
or

* Use folder on your localhost named as [folderName]. See AxesHelper above.
* Download [AxesHelper](https://github.com/anhr/AxesHelper) repository into your "[folderName]\AxesHelper\master" folder.
```
import { AxesHelperGui } from './AxesHelper/master/AxesHelperGui.js';
```

Now you can use SpriteTextGui in your javascript code.
```
const gui =  new dat.GUI();
const folder = SpriteTextGui( SpriteText, gui, spriteText, {

	//getLanguageCode: getLanguageCode,
	//cookie: cookie,

} );
```
If you want to localize the gui, please uncomment
```
getLanguageCode: getLanguageCode,
```
line above and import getLanguageCode.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
If you want save a custom SpriteText settings to the cookie, please uncomment
```
cookie: cookie,
```
line in the SpriteTextGui.gui(...) above and import cookie.
```
import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
```
or download [cookieNodeJS](https://github.com/anhr/cookieNodeJS) repository into your "[folderName]\cookieNodeJS\master" folder.
```
import cookie from './cookieNodeJS/master/cookie.js';
```

## On the following browsers have been successfully tested:

Windows 10

	IE 11 Fatal error: Your browser do not support modular JavaScript code

	Microsoft Edge 44

	Chrome 83

	Opera 68

	Safari 5.1.7 Fatal error: Your browser do not support modular JavaScript code

	FireFox 72

Android 6.0.1

	Chrome 83

	Samsung Internet 12

	FireFox 68

	Opera 59

	Opera Mini 50

LG Smart tv

	Chrome - Fatal error: Your browser do not support modular JavaScript code


 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
