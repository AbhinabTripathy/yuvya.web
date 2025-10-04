import { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Product, Color } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, RotateCcw, Move, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadImage, removeBackground } from '@/utils/backgroundRemoval';
import { toast } from '@/hooks/use-toast';

interface ARViewerProps {
  product: Product | null;
  selectedColor: Color | null;
  isOpen: boolean;
  onClose: () => void;
}

// Simple 3D furniture component for AR
const ARFurniture = ({ product, selectedColor, position = [0, 0, 0], scale = 1 }: {
  product: Product;
  selectedColor: Color;
  position?: [number, number, number];
  scale?: number;
}) => {
  const color = selectedColor.hex;
  
  if (product.category === 'Seating') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.25, -0.4]}>
          <boxGeometry args={[2, 1.5, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-1, 0.75, 0]}>
          <boxGeometry args={[0.3, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[1, 0.75, 0]}>
          <boxGeometry args={[0.3, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }
  
  if (product.category === 'Tables') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 0.1, 1.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {[[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z * 0.6]}>
            <boxGeometry args={[0.1, 2, 0.1]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (product.category === 'Storage') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2, 3, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {[-0.8, 0, 0.8].map((y, i) => (
          <mesh key={i} position={[0, y + 1.5, 0]}>
            <boxGeometry args={[1.8, 0.05, 0.7]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    );
  }
  
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const ARViewer = ({ product, selectedColor, isOpen, onClose }: ARViewerProps) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'ar'>('camera');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [furniturePosition, setFurniturePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [furnitureScale, setFurnitureScale] = useState(0.5);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('ar');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setBackgroundImage(imageData);
        stopCamera();
        toast({
          title: "Photo Captured!",
          description: "Photo captured successfully. Now place your furniture!",
        });
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Show progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
      setMode('ar');
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Image Uploaded!",
        description: "Image uploaded successfully. Now place your furniture!",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const downloadARImage = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${product?.name}-ar-preview.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "AR preview image saved to your device.",
      });
    }
  }, [product]);

  const resetView = useCallback(() => {
    setBackgroundImage(null);
    setMode('camera');
    setFurniturePosition([0, 0, 0]);
    setFurnitureScale(0.5);
    stopCamera();
  }, [stopCamera]);

  if (!product || !selectedColor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-forest-green">
            <Camera className="w-5 h-5" />
            AR Preview - {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-4 gap-6 mt-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-charcoal">Mode</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className={cn(
                    buttonVariants({ variant: mode === 'camera' ? 'default' : 'outline', size: 'sm' })
                  )}
                  onClick={() => setMode('camera')}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Camera
                </Button>
                <Button
                  className={cn(
                    buttonVariants({ variant: mode === 'upload' ? 'default' : 'outline', size: 'sm' })
                  )}
                  onClick={() => setMode('upload')}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            {mode === 'camera' && !backgroundImage && (
                <Button
                  className={cn(buttonVariants({ variant: 'hero' }), "w-full")}
                  onClick={startCamera}
                >
                Start Camera
              </Button>
            )}

            {mode === 'upload' && (
              <div className="space-y-2">
                <Button
                  className={cn(buttonVariants({ variant: 'terracotta' }), "w-full")}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground text-center">
                      Processing image...
                    </p>
                  </div>
                )}
              </div>
            )}

            {(mode === 'ar' || backgroundImage) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-charcoal">Position</h4>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0] - 0.5, prev[1], prev[2]])}
                    >
                      ←
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0], prev[1], prev[2] - 0.5])}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0] + 0.5, prev[1], prev[2]])}
                    >
                      →
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0], prev[1] + 0.2, prev[2]])}
                    >
                      ↕
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0], prev[1], prev[2] + 0.5])}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurniturePosition(prev => [prev[0], prev[1] - 0.2, prev[2]])}
                    >
                      ↕
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-charcoal">Scale</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurnitureScale(prev => Math.max(0.1, prev - 0.1))}
                    >
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFurnitureScale(prev => Math.min(2, prev + 0.1))}
                    >
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Scale: {furnitureScale.toFixed(1)}x
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button
                    className={cn(buttonVariants({ variant: 'outline' }), "w-full")}
                    onClick={resetView}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  
                  {backgroundImage && (
                    <Button
                      className={cn(buttonVariants({ variant: 'terracotta' }), "w-full")}
                      onClick={downloadARImage}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Image
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="p-3 bg-warm-cream rounded-lg text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <p className="text-sm font-medium">{selectedColor.name}</p>
              <p className="text-xs text-muted-foreground">{product.name}</p>
            </div>
          </div>

          {/* AR View */}
          <div className="lg:col-span-3 relative">
            <div className="relative w-full h-96 lg:h-[500px] bg-muted rounded-lg overflow-hidden">
              {mode === 'camera' && cameraStream && (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0">
                    <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                      <ambientLight intensity={0.6} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <ARFurniture 
                        product={product} 
                        selectedColor={selectedColor}
                        position={furniturePosition}
                        scale={furnitureScale}
                      />
                      <OrbitControls enablePan={false} />
                    </Canvas>
                  </div>
                  <Button
                    className={cn(buttonVariants({ variant: 'hero' }), "absolute bottom-4 left-1/2 transform -translate-x-1/2")}
                    onClick={capturePhoto}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              )}

              {backgroundImage && (
                <div className="relative w-full h-full">
                  <img
                    src={backgroundImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10">
                    <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                      <ambientLight intensity={0.8} />
                      <pointLight position={[10, 10, 10]} intensity={1.2} />
                      <ARFurniture 
                        product={product} 
                        selectedColor={selectedColor}
                        position={furniturePosition}
                        scale={furnitureScale}
                      />
                      <OrbitControls enablePan={false} />
                    </Canvas>
                  </div>
                </div>
              )}

              {mode === 'camera' && !cameraStream && !backgroundImage && (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Click "Start Camera" to begin AR preview</p>
                  </div>
                </div>
              )}

              {mode === 'upload' && !backgroundImage && !isProcessing && (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Upload a photo of your room to see the furniture</p>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};