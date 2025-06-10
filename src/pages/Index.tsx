import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Play, Settings, Info, Image as ImageIcon, Layers, Zap, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoraSection from "@/components/LoraSection";
import ControlSection from "@/components/ControlSection";
import DocumentationPanel from "@/components/DocumentationPanel";

const Index = () => {
  const [prompt, setPrompt] = useState("Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPromptFocused, setIsPromptFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  // Backend configuration - replace with your ngrok URL
  const backendUrl = "http://localhost:8000"; // Change this to your ngrok URL when needed

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
      
      const response = await fetch(`${backendUrl}/generate-image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          prompt: prompt,
          width: 512,
          height: 512,
          guidance_scale: 7.5,
          num_inference_steps: 20
        })
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
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
              <TabsTrigger 
                value="playground" 
                className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Playground
              </TabsTrigger>
              <TabsTrigger 
                value="api" 
                className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                API
              </TabsTrigger>
              <TabsTrigger 
                value="examples" 
                className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Examples
              </TabsTrigger>
              <TabsTrigger 
                value="docs" 
                className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Documentation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playground" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Input
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                          Prompt
                          <Info className="w-4 h-4 text-slate-500" />
                        </label>
                        <div className="relative">
                          <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onFocus={() => setIsPromptFocused(true)}
                            onBlur={() => setIsPromptFocused(false)}
                            placeholder="Describe what you want to generate..."
                            className={`min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 resize-none transition-all duration-300 ${
                              isPromptFocused 
                                ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]' 
                                : 'hover:border-slate-500'
                            }`}
                          />
                          {isPromptFocused && (
                            <div className="absolute inset-0 rounded-md border-2 border-purple-500 animate-pulse pointer-events-none" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="animate-in slide-in-from-left-2 duration-700 delay-100">
                    <LoraSection />
                  </div>
                  
                  <div className="animate-in slide-in-from-left-2 duration-700 delay-200">
                    <ControlSection />
                  </div>

                  <div className="relative">
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 
                        transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 
                        active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none
                        ${isGenerating ? 'animate-pulse' : ''}
                      `}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span className="animate-pulse">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                          Generate
                        </>
                      )}
                    </Button>
                    
                    {/* Ripple effect overlay */}
                    <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
                      <div className={`absolute inset-0 bg-white/20 rounded-full scale-0 ${
                        isGenerating ? 'animate-ping' : ''
                      }`} />
                    </div>

                    {/* Success checkmark */}
                    {showSuccess && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-md animate-in fade-in-0 duration-300">
                        <Check className="w-6 h-6 text-green-400 animate-in scale-in-0 duration-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Result Section */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Result
                        <Badge variant="secondary" className={`ml-auto transition-all duration-300 ${
                          isGenerating 
                            ? "bg-orange-500/20 text-orange-300 animate-pulse" 
                            : generatedImage 
                              ? "bg-green-500/20 text-green-300" 
                              : "bg-slate-700 text-slate-300"
                        }`}>
                          {isGenerating ? "Generating..." : generatedImage ? "Complete" : "Idle"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {isGenerating ? (
                          <div className="text-center">
                            {/* Shimmer loader */}
                            <div className="absolute inset-0 shimmer-bg animate-shimmer" />
                            <div className="animate-pulse relative z-10">
                              <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                              <p className="text-slate-400">Generating your image...</p>
                            </div>
                          </div>
                        ) : generatedImage ? (
                          <img 
                            src={generatedImage} 
                            alt="Generated image"
                            className="w-full h-full object-cover rounded-lg animate-in fade-in-0 scale-in-95 duration-700"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="text-center transition-all duration-300 hover:scale-105">
                            <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4 transition-colors duration-300" />
                            <p className="text-slate-500">Click Generate to create an image</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
