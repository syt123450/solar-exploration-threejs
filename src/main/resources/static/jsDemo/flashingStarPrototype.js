/**
 * Created by ss on 2017/9/28.
 */

var scene, camera, renderer, earthMesh, atmosphereMesh;

var stars = [];
var starPositions = [
    [-7, 3, -15], [-8, 4, -16],
    [-9, 2, -14], [-10, 3, -15], [-8, 4, -10],
    [-9, 5, -15],
    [-6, -3, -15], [-6, -4, -15], [-7, -2, -15],
    [-10, 0, -15], [-8, -4, -13],
    [7, 3, -15], [8, 4, -16], [9, 2, -14],
    [12, 3, -15], [3, 4, -11], [9, 5, -15],
    [8, -4, -15], [7, -2, -15], [10, 0, -15],
    [8, -4, -13], [6, -3, -15]];

scene = new THREE.Scene();
init();
animate();

function init() {

    initLight();
    initCamera();
    initRenderer();
    initUniverse();
    initEarth();
    initStars();
}

function initLight() {

    scene.add(new THREE.AmbientLight(0xffffff));
}

function initCamera() {

    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
    camera.position.set(0, 0, 1.5);
}

function initRenderer() {

    var threeElement = document.getElementById('sceneArea');
    renderer = new THREE.WebGLRenderer({canvas: threeElement, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initUniverse() {

    var starMesh = new THREE.Mesh(
        new THREE.SphereGeometry(90, 64, 64),
        new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(
                    '../images/galaxy_starfield.png'
                ),
                side: THREE.BackSide
            }
        )
    );
    scene.add(starMesh);
}

function initEarth() {

    earthMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(
                    '../images/2_no_clouds_4k.jpg'
                ),
                bumpScale: 0.05,
                bumpMap: new THREE.TextureLoader().load(
                    '../images/earthbump1k.jpg'
                ),
                specular: new THREE.Color('grey'),
                specularMap: new THREE.TextureLoader().load(
                    '../images/water_4k.png'
                )
            }
        )
    );

    atmosphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.504, 32, 32),
        new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(
                    '../images/fair_clouds_4k.png'
                ),
                transparent: true
            }
        )
    );

    var aggregation = new THREE.Object3D();
    aggregation.add(earthMesh);
    aggregation.add(atmosphereMesh);
    aggregation.rotateZ(-Math.PI * 23.5 / 180);

    scene.add(aggregation);
}

function initStars() {

    console.log(starPositions.length);

    for (var i = 0; i < starPositions.length; i++) {
        stars[i] = initOneStar();
        stars[i].position.x = starPositions[i][0];
        stars[i].position.y = starPositions[i][1];
        stars[i].position.z = starPositions[i][2];
        scene.add(stars[i]);
    }
}

function initOneStar() {

    var geometry = new THREE.SphereGeometry(0.05, 32, 32);
    var material = new THREE.MeshBasicMaterial( {color: 0xd3d3d3} );

    var star = new THREE.Mesh(geometry, material);
    star.count = 0;
    return star;
}

function animate() {

    requestAnimationFrame(animate);

    animateFlashing();

    renderer.render(scene, camera);
}

function animateFlashing() {

    for (var i = 0; i < stars.length; i++) {
        stars[i].count += Math.random() > 0.5 ? 2 : 3;
        if (stars[i].count > 40) {
            stars[i].material.color.set(stars[i].material.color.getHex() == 0xd3d3d3 ? 0xffffff : 0xd3d3d3);
            stars[i].count = 0;
        }
    }
}