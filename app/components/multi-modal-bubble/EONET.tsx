'use client'
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GlobeData, GlobeDataArrayResponse } from '@/types/globe';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import CloseIcon from '@/public/close-icon.svg';
import { Message } from 'ai';
import Markdown from 'react-markdown';

export default function EONET({ result, message }: { result: GlobeDataArrayResponse, message: Message }) {
    const [showModal, setShowModal] = useState(false);

    function handleToggleModal() {
        setShowModal(prev => !prev)
    }

    return (
        <>
        <Markdown>{message.content}</Markdown>
        <div className='w-full h-full bg-[#16132b] p-4 flex items-center cursor-pointer' onClick={handleToggleModal}>
            <h4 className='font-semibold text-lg text-white'>Click here to see the 3D visualization</h4>
        </div>
        <Globe result={result.data} showModal={showModal} toggleModal={handleToggleModal} />
        </>
    )
}

function Globe({ result, showModal, toggleModal }: { result: Array<GlobeData>, showModal: boolean, toggleModal: () => void }) {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const colorInterpolator = (t: number): string => `rgba(255,100,50,${1-t})`;

    if (typeof window !== 'undefined' && showModal) {
        const Globe = new ThreeGlobe()
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .labelsData(result)
          .labelText((d: object) => {
            if ('title' in d) {
                return d.title as string;
            }
            return "Title"
        })
          .labelSize(1)
          .labelDotRadius((d: object) => 'size' in d ? d.size as number / 5 : 1)
          .labelColor('color')
          .ringsData(result)
          .ringColor(() => colorInterpolator)
          .ringMaxRadius('maxR')
          .ringPropagationSpeed('propagationSpeed')
          .ringRepeatPeriod('repeatPeriod');
    
        // Setup renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (refContainer.current) {
            refContainer.current.appendChild( renderer.domElement );
        }
            // Setup scene
        const scene = new THREE.Scene();
        scene.add(Globe);
        scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));
    
        // Setup camera
        const camera = new THREE.PerspectiveCamera();
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position.z = 300;
    
        // Add camera controls
        const tbControls = new TrackballControls(camera, renderer.domElement);
        tbControls.minDistance = 101;
        tbControls.rotateSpeed = 5;
        tbControls.zoomSpeed = 0.8;
    
        // Kick-off renderer
        (function animate() { // IIFE
          // Frame cycle
          tbControls.update();
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        })();
    }
  }, [result, showModal]);

  if (showModal) {
      return createPortal(
        <main className='absolute top-0 left-0 z-50 w-full h-screen bg-black/50 flex justify-center items-center'>
            <section id='modal-container' className='w-[80%] h-[80%] bg-[#232037] p-6 rounded-2xl'>
                <div id='modal-header' className='w-full mb-4 py-2 flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-white'>Map of Natural Events based on Nasa Open API</h2>
                    <Image
                        src={CloseIcon}
                        alt='Close Icon'
                        sizes='100vw'
                        className='cursor-pointer'
                        style={{ width: '20px', height: '20px' }}
                        onClick={toggleModal}
                     />
                </div>
                <div id='web-gl-wrapper' className='w-full overflow-hidden'>
                    <div id='web-gl-container' ref={refContainer}></div>
                </div>
            </section>
        </main>,
        document.getElementById('modal-root') as HTMLDivElement
      );
  }
}
