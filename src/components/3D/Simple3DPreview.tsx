import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';
import { Suspense } from 'react';
import { Product, Color } from '@/types/product';

interface Simple3DPreviewProps {
  product: Product;
  selectedColor: Color;
  className?: string;
}

// Simple 3D representation based on product category
const ProductMesh = ({ product, selectedColor }: { product: Product; selectedColor: Color }) => {
  const color = selectedColor.hex;
  
  if (product.category === 'Seating') {
    // Simple sofa/chair representation
    return (
      <group>
        {/* Main body */}
        <Box args={[2, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
        {/* Backrest */}
        <Box args={[2, 1.5, 0.2]} position={[0, 0.75, -0.4]}>
          <meshStandardMaterial color={color} />
        </Box>
        {/* Arms */}
        <Box args={[0.3, 1, 1]} position={[-1, 0.25, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
        <Box args={[0.3, 1, 1]} position={[1, 0.25, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
      </group>
    );
  }
  
  if (product.category === 'Tables') {
    return (
      <group>
        {/* Table top */}
        <Box args={[3, 0.1, 1.5]} position={[0, 1, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
        {/* Legs */}
        {[[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]].map(([x, z], i) => (
          <Box key={i} args={[0.1, 2, 0.1]} position={[x, 0, z * 0.6]}>
            <meshStandardMaterial color="#444" />
          </Box>
        ))}
      </group>
    );
  }
  
  if (product.category === 'Storage') {
    return (
      <group>
        {/* Main frame */}
        <Box args={[2, 3, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
        {/* Shelves */}
        {[-0.8, 0, 0.8].map((y, i) => (
          <Box key={i} args={[1.8, 0.05, 0.7]} position={[0, y, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
        ))}
      </group>
    );
  }
  
  // Default shape
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

export const Simple3DPreview = ({ product, selectedColor, className }: Simple3DPreviewProps) => {
  return (
    <div className={`w-full h-64 bg-gradient-product rounded-lg overflow-hidden ${className}`}>
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ProductMesh product={product} selectedColor={selectedColor} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};