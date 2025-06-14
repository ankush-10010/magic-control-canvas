
import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TabNavigation from "@/components/TabNavigation";
import PlaygroundContent from "@/components/PlaygroundContent";
import DocumentationPanel from "@/components/DocumentationPanel";
import { backendConfig, getApiUrl } from "@/config/backend";

const Index = () => {
  const [prompt, setPrompt] = useState("Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // New generation parameters
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numInferenceSteps, setNumInferenceSteps] = useState(20);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [controlImage, setControlImage] = useState<File | null>(null);
  const [loraScales, setLoraScales] = useState<Record<string, number>>({});
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      console.log("Sending request to backend...");
      
      // Create FormData for multipart request
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('height', height.toString());
      formData.append('width', width.toString());
      formData.append('num_inference_steps', numInferenceSteps.toString());
      formData.append('guidance_scale', guidanceScale.toString());
      
      // Add control image if selected
      if (controlImage) {
        formData.append('control_image', controlImage);
      }
      
      // Add LoRA scales if any
      if (Object.keys(loraScales).length > 0) {
        formData.append('lora_scales', JSON.stringify(loraScales));
      }

      const response = await fetch(getApiUrl('/generate-image/'), {
        method: 'POST',
        headers: backendConfig.headers,
        body: formData
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convert response to blob
      const imageBlob = await response.blob();
      console.log("Image blob received, size:", imageBlob.size);
      
      // Create object URL from blob
      const imageUrl = URL.createObjectURL(imageBlob);
      console.log("Image URL created:", imageUrl);
      setGeneratedImage(imageUrl);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Make sure your backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Clean up object URL when component unmounts or image changes
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", e);
    toast({
      title: "Error",
      description: "Failed to display the generated image",
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LoRA Integration</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Inference
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                Commercial use
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabNavigation activeTab={activeTab} />

            <TabsContent value="playground" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
              <PlaygroundContent
                prompt={prompt}
                onPromptChange={setPrompt}
                controlImage={controlImage}
                onControlImageChange={setControlImage}
                width={width}
                height={height}
                numInferenceSteps={numInferenceSteps}
                guidanceScale={guidanceScale}
                loraScales={loraScales}
                onWidthChange={setWidth}
                onHeightChange={setHeight}
                onStepsChange={setNumInferenceSteps}
                onGuidanceScaleChange={setGuidanceScale}
                onLoraScalesChange={setLoraScales}
                isGenerating={isGenerating}
                generatedImage={generatedImage}
                showSuccess={showSuccess}
                onGenerate={handleGenerate}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
              />
            </TabsContent>

            <TabsContent value="docs" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
              <DocumentationPanel />
            </TabsContent>

            <TabsContent value="api" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">API endpoints and integration guides coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Example Generations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">Example gallery and templates coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 2s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default Index;
