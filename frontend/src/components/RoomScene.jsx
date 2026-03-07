import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';

function RoomModel({ roomType = 'Standard' }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
        }
    });

    const getColor = () => {
        switch (roomType?.toLowerCase()) {
            case 'deluxe': return '#7C3AED';
            case 'suite': return '#F59E0B';
            case 'premium': return '#00A699';
            default: return '#FF385C';
        }
    };

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
            <group ref={groupRef} scale={0.8}>
                {/* Room base */}
                <RoundedBox args={[2, 0.1, 1.5]} radius={0.05} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color="#1A1A3E" metalness={0.5} roughness={0.3} />
                </RoundedBox>
                {/* Bed */}
                <RoundedBox args={[1, 0.2, 0.8]} radius={0.05} position={[0, -0.3, 0]}>
                    <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.5} />
                </RoundedBox>
                {/* Headboard */}
                <RoundedBox args={[1, 0.5, 0.05]} radius={0.02} position={[0, -0.1, -0.4]}>
                    <meshStandardMaterial color={getColor()} metalness={0.4} roughness={0.4} />
                </RoundedBox>
                {/* Pillow */}
                <RoundedBox args={[0.3, 0.08, 0.2]} radius={0.04} position={[-0.2, -0.15, -0.2]}>
                    <meshStandardMaterial color="white" metalness={0.1} roughness={0.8} />
                </RoundedBox>
                <RoundedBox args={[0.3, 0.08, 0.2]} radius={0.04} position={[0.2, -0.15, -0.2]}>
                    <meshStandardMaterial color="white" metalness={0.1} roughness={0.8} />
                </RoundedBox>
                {/* Side table */}
                <RoundedBox args={[0.25, 0.3, 0.25]} radius={0.02} position={[0.8, -0.35, -0.2]}>
                    <meshStandardMaterial color="#111128" metalness={0.5} roughness={0.3} />
                </RoundedBox>
                {/* Lamp */}
                <mesh position={[0.8, -0.1, -0.2]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.8} />
                </mesh>
            </group>
        </Float>
    );
}

export default function RoomScene({ roomType }) {
    return (
        <Canvas
            camera={{ position: [2, 1.5, 2], fov: 50 }}
            style={{ width: '100%', height: '100%', borderRadius: '16px' }}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={1} />
            <pointLight position={[-2, 2, 2]} intensity={0.5} color="#FF385C" />
            <pointLight position={[2, 2, -2]} intensity={0.3} color="#7C3AED" />
            <RoomModel roomType={roomType} />
        </Canvas>
    );
}
