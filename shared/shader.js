// ─── Shader Animation (full-page background) ─────────────────────────
function initShader(){
  if(typeof THREE==='undefined'){
    // Three.js not loaded yet (deferred), retry
    window.addEventListener('DOMContentLoaded',()=>setTimeout(initShader,100));
    return;
  }
  try{
  const container=document.getElementById('shader-bg');
  if(!container)return;

  const vertexShader=`void main(){gl_Position=vec4(position,1.0);}`;
  const fragmentShader=`
    #define TWO_PI 6.2831853072
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    void main(void){
      vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
      float t=time*0.05;
      float lw=0.002;
      vec3 color=vec3(0.0);
      for(int j=0;j<3;j++){
        for(int i=0;i<5;i++){
          color[j]+=lw*float(i*i)/abs(fract(t-0.01*float(j)+float(i)*0.01)*5.0-length(uv)+mod(uv.x+uv.y,0.2));
        }
      }
      gl_FragColor=vec4(color,1.0);
    }`;

  const camera=new THREE.Camera();
  camera.position.z=1;
  const scene=new THREE.Scene();
  const geo=new THREE.PlaneGeometry(2,2);
  const uniforms={time:{value:1.0},resolution:{value:new THREE.Vector2()}};
  const mat=new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader});
  scene.add(new THREE.Mesh(geo,mat));
  const renderer=new THREE.WebGLRenderer({antialias:false,alpha:true});
  // Cap DPR at 2, render at half resolution for performance
  const dpr=Math.min(window.devicePixelRatio||1,2)*0.5;
  renderer.setPixelRatio(dpr);
  container.appendChild(renderer.domElement);

  function resize(){
    const w=window.innerWidth,h=window.innerHeight;
    renderer.setSize(w,h);
    uniforms.resolution.value.set(renderer.domElement.width,renderer.domElement.height);
  }
  resize();
  window.addEventListener('resize',resize);

  let animId;
  function animate(){
    if(document.hidden){animId=requestAnimationFrame(animate);return;}
    animId=requestAnimationFrame(animate);
    uniforms.time.value+=0.05;
    renderer.render(scene,camera);
  }
  animate();

  // Pause/resume on tab visibility
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden&&!animId)animate();
  });
  }catch(e){
    // WebGL not available — app works fine without shader
    console.warn('Shader init failed:',e);
  }
}

// Auto-init
if (typeof THREE !== 'undefined') {
  initShader();
} else {
  window.addEventListener('DOMContentLoaded', () => setTimeout(initShader, 100));
}
