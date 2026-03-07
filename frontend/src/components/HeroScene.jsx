import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingHouse({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
            <group ref={groupRef} position={position} scale={scale}>
                {/* Main building body */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.8, 1.2, 1.4]} />
                    <meshStandardMaterial color="#FF385C" metalness={0.3} roughness={0.4} />
                </mesh>
                {/* Roof */}
                <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <coneGeometry args={[1.5, 0.8, 4]} />
                    <meshStandardMaterial color="#7C3AED" metalness={0.4} roughness={0.3} />
                </mesh>
                {/* Door */}
                <mesh position={[0, -0.2, 0.71]}>
                    <boxGeometry args={[0.35, 0.6, 0.02]} />
                    <meshStandardMaterial color="#0A0A1A" metalness={0.5} roughness={0.2} />
                </mesh>
                {/* Windows */}
                <mesh position={[-0.5, 0.15, 0.71]}>
                    <boxGeometry args={[0.3, 0.3, 0.02]} />
                    <meshStandardMaterial color="#A78BFA" emissive="#7C3AED" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0.5, 0.15, 0.71]}>
                    <boxGeometry args={[0.3, 0.3, 0.02]} />
                    <meshStandardMaterial color="#A78BFA" emissive="#7C3AED" emissiveIntensity={0.5} />
                </mesh>
                {/* Chimney */}
                <mesh position={[0.5, 1.1, -0.2]}>
                    <boxGeometry args={[0.2, 0.5, 0.2]} />
                    <meshStandardMaterial color="#FF5A7E" metalness={0.3} roughness={0.5} />
                </mesh>
            </group>
        </Float>
    );
}

function GlowingSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <Sphere ref={meshRef} args={[2.5, 64, 64]} position={[0, 0, -3]}>
            <MeshDistortMaterial
                color="#7C3AED"
                attach="material"
                distort={0.25}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
                opacity={0.15}
                transparent
            />
        </Sphere>
    );
}

function Particles({ count = 300 }) {
    const points = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            temp[i] = (Math.random() - 0.5) * 20;
            temp[i + 1] = (Math.random() - 0.5) * 20;
            temp[i + 2] = (Math.random() - 0.5) * 20;
        }
        return temp;
    }, [count]);

    const sizes = useMemo(() => {
        const temp = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            temp[i] = Math.random() * 0.03 + 0.01;
        }
        return temp;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#FF385C"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function OrbitingRings() {
    const ring1 = useRef();
    const ring2 = useRef();
    const ring3 = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring1.current) ring1.current.rotation.y = t * 0.3;
        if (ring2.current) ring2.current.rotation.x = t * 0.2;
        if (ring3.current) ring3.current.rotation.z = t * 0.25;
    });

    return (
        <>
            <mesh ref={ring1} position={[0, 0, 0]}>
                <torusGeometry args={[3, 0.02, 16, 80]} />
                <meshStandardMaterial color="#FF385C" transparent opacity={0.3} emissive="#FF385C" emissiveIntensity={0.5} />
            </mesh>
            <mesh ref={ring2} position={[0, 0, 0]} rotation={[1.2, 0, 0]}>
                <torusGeometry args={[3.5, 0.015, 16, 80]} />
                <meshStandardMaterial color="#7C3AED" transparent opacity={0.2} emissive="#7C3AED" emissiveIntensity={0.5} />
            </mesh>
            <mesh ref={ring3} position={[0, 0, 0]} rotation={[0.6, 0.8, 0]}>
                <torusGeometry args={[4, 0.01, 16, 80]} />
                <meshStandardMaterial color="#00A699" transparent opacity={0.15} emissive="#00A699" emissiveIntensity={0.5} />
            </mesh>
        </>
    );
}

export default function HeroScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 7], fov: 60 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-5, 3, 3]} intensity={0.8} color="#FF385C" />
            <pointLight position={[5, -3, 3]} intensity={0.6} color="#7C3AED" />

            <FloatingHouse position={[0, 0.3, 0]} scale={1.2} />
            <GlowingSphere />
            <OrbitingRings />
            <Particles count={400} />
            <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={0.5} />
        </Canvas>
    );
}
