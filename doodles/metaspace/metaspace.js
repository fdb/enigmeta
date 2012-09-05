var camera, scene, renderer;
var geometry, material, mesh;
var stats;

var agents = [];

function random(start, end) {
  return start + Math.random() * (end-start);
}

function createAgent() {
  var geometry = new THREE.PlaneGeometry(random(1, 100), 1);
  var color = new THREE.Color();
  color.setHSV(0.5, 0.8, Math.random());
  var material = new THREE.MeshBasicMaterial({color:color, wireframe: true, wireframeLineWidth: 2}); 
  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = random(Math.PI * 2, -Math.PI * 2);
  mesh.position.x = 0; random(-100, 100);
  mesh.position.y = 0;random(-100, 100);
  mesh.position.z = 0; // random(-500, 500);

  var vel = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
  vel = vel.negate();
  vel = vel.multiplyScalar(0.01);



  return {
    velocity: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, 0),
    mesh: mesh
  };
}
      



function init() {
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;

  scene = new THREE.Scene();

  _.each(_.range(1000), function () {
    var agent = createAgent();
    agent.mesh.x = 
    agents.push(agent);
    scene.add(agent.mesh);
  });
  

  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true } );
  renderer.autoClear=false;
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.getElementById('container').appendChild( renderer.domElement );

  $(document).on('keydown', keyDown);
  $(document).on('keyup', keyUp);

}

function initStats() {
  var container = document.getElementById( 'container' );
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0';
  container.appendChild(stats.domElement);
}

function animate() {
  requestAnimationFrame( animate );
  if (stats) stats.update();


  _.each(agents, function(agent) {
    agent.mesh.position.addSelf(agent.velocity);
    agent.mesh.rotation.x += 0.01;
    agent.mesh.rotation.y += 0.02;
  });
  
  renderer.render( scene, camera );
}

function keyDown(e) {
  if (e.keyCode == 32) { // Spacebar
    _.each(agents, function(agent) {
      var vel = new THREE.Vector3(agent.mesh.position.x, agent.mesh.position.y, 0);
      vel = vel.negate();
      vel = vel.multiplyScalar(0.0001);
      agent.velocity.addSelf(vel);
    });
    return false;
  } else if (e.keyCode == 67) { // 'c'
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.clear(true);
  }
}

function keyUp(e) {
  if (e.keyCode == 32) {
    _.each(agents, function(agent) {
      vel = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, 0);
      vel = vel.multiplyScalar(2);
      
      agent.velocity = agent.velocity.multiplyScalar(0.1);
      agent.velocity.addSelf(vel);
      return false;
    });
  }
}

$(function() {
  init();
  animate();
});
