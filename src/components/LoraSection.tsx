import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Layers, Info, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/backend";

interface LoraItem {
  id: string;
  name: string;
  path: string;
  scale: number;
}

const LoraSection = () => {
  const [loras, setLoras] = useState<LoraItem[]>([]);
  const [newLoraName, setNewLoraName] = useState('');
  const [newLoraPath, setNewLoraPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const addLora = async () => {
    if (!newLoraPath) {
      toast({
        title: "Error",
        description: "LoRA Path/ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!newLoraName) {
      toast({
        title: "Error",
        description: "LoRA Name is required (used as adapter name)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("lora_path", newLoraPath);
      formData.append("adapter_name", newLoraName);

      const response = await fetch(getApiUrl("/load-lora/"), {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Add to local state for UI tracking
        const newLora: LoraItem = {
          id: Date.now().toString(),
          name: newLoraName,
          path: newLoraPath,
          scale: 1.0
        };
        setLoras([...loras, newLora]);
        setNewLoraName('');
        setNewLoraPath('');

        // Show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        toast({
          title: "Success",
          description: result.message || "LoRA loaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.detail || result.message || "Failed to load LoRA",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the backend. Make sure your FastAPI server is running on http://localhost:8000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeLora = (id: string) => {
    setLoras(loras.filter(lora => lora.id !== id));
  };

  const updateLoraScale = (id: string, scale: number) => {
    setLoras(loras.map(lora => 
      lora.id === id ? { ...lora, scale } : lora
    ));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Layers className="w-5 h-5" />
          LoRAs
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-slate-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Low-Rank Adaptation models for fine-tuning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add LoRA Form */}
        <div className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:shadow-md">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 text-sm">Name (Adapter Name) *</Label>
              <Input
                value={newLoraName}
                onChange={(e) => setNewLoraName(e.target.value)}
                placeholder="LoRA adapter name"
                className="bg-slate-800 border-slate-600 text-white transition-all duration-300 hover:border-slate-500 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Path/ID *</Label>
              <Input
                value={newLoraPath}
                onChange={(e) => setNewLoraPath(e.target.value)}
                placeholder="model/path or ID"
                className="bg-slate-800 border-slate-600 text-white transition-all duration-300 hover:border-slate-500 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="relative">
            <Button 
              onClick={addLora}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
              disabled={!newLoraPath || !newLoraName || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading LoRA...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add LoRA
                </>
              )}
            </Button>
            
            {/* Success overlay */}
            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-md animate-in fade-in-0 duration-300">
                <Check className="w-5 h-5 text-green-400 animate-in scale-in-0 duration-500" />
              </div>
            )}
          </div>
        </div>

        {/* LoRA List */}
        <div className="space-y-3">
          {loras.length === 0 ? (
            <div className="text-center py-6 text-slate-400 transition-all duration-300 hover:text-slate-300">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No LoRAs added yet</p>
            </div>
          ) : (
            loras.map((lora, index) => (
              <div key={lora.id} className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:shadow-md animate-in slide-in-from-left-2 duration-500" 
                   style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{lora.name}</h4>
                    <p className="text-sm text-slate-400">{lora.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 transition-all duration-300 hover:bg-slate-600">
                      {lora.scale.toFixed(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLora(lora.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Scale: {lora.scale}</Label>
                  <Slider
                    value={[lora.scale]}
                    onValueChange={(value) => updateLoraScale(lora.id, value[0])}
                    max={2}
                    min={-2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoraSection;
