
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Play, Settings, Info, Image as ImageIcon, Layers, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoraSection from "@/components/LoraSection";
import ControlSection from "@/components/ControlSection";
import DocumentationPanel from "@/components/DocumentationPanel";

const Index = () => {
  const [prompt, setPrompt] = useState("Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convert response to blob
      const imageBlob = await response.blob();
      console.log("Image blob received, size:", imageBlob.size);
      
      // Create object URL from blob
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);

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

  return (
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
            <TabsTrigger value="playground" className="data-[state=active]:bg-purple-600">Playground</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-600">API</TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-purple-600">Examples</TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-purple-600">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
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
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to generate..."
                        className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                <LoraSection />
                <ControlSection />

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Result Section */}
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Result
                      <Badge variant="secondary" className="ml-auto bg-slate-700 text-slate-300">
                        {isGenerating ? "Generating..." : generatedImage ? "Complete" : "Idle"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {isGenerating ? (
                        <div className="text-center">
                          <div className="animate-pulse">
                            <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-400">Generating your image...</p>
                          </div>
                        </div>
                      ) : generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="Generated image"
                          className="w-full h-full object-contain rounded-lg"
                          onLoad={() => {
                            // Clean up object URL after image loads
                            URL.revokeObjectURL(generatedImage);
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-500">Click Generate to create an image</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="mt-6">
            <DocumentationPanel />
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">API endpoints and integration guides coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
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
  );
};

export default Index;
