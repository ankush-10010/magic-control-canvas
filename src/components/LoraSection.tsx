
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Layers, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const addLora = () => {
    if (newLoraName && newLoraPath) {
      const newLora: LoraItem = {
        id: Date.now().toString(),
        name: newLoraName,
        path: newLoraPath,
        scale: 1.0
      };
      setLoras([...loras, newLora]);
      setNewLoraName('');
      setNewLoraPath('');
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
    <Card className="bg-slate-800/50 border-slate-700">
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
        <div className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 text-sm">Name</Label>
              <Input
                value={newLoraName}
                onChange={(e) => setNewLoraName(e.target.value)}
                placeholder="LoRA name"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Path/ID</Label>
              <Input
                value={newLoraPath}
                onChange={(e) => setNewLoraPath(e.target.value)}
                placeholder="model/path or ID"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button 
            onClick={addLora}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!newLoraName || !newLoraPath}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add LoRA
          </Button>
        </div>

        {/* LoRA List */}
        <div className="space-y-3">
          {loras.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No LoRAs added yet</p>
            </div>
          ) : (
            loras.map((lora) => (
              <div key={lora.id} className="p-3 bg-slate-900/30 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{lora.name}</h4>
                    <p className="text-sm text-slate-400">{lora.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {lora.scale.toFixed(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLora(lora.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
