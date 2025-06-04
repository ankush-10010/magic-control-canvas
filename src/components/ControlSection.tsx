
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Settings, Grid, Image, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ControlItem {
  id: string;
  name: string;
  type: string;
  strength: number;
  startStep: number;
  endStep: number;
  imageUrl?: string;
}

interface ControlUnion {
  id: string;
  name: string;
  controls: ControlItem[];
  mode: 'more_prompt' | 'more_control' | 'balanced';
}

const ControlSection = () => {
  const [controlLoras, setControlLoras] = useState<ControlItem[]>([]);
  const [controlNets, setControlNets] = useState<ControlItem[]>([]);
  const [controlUnions, setControlUnions] = useState<ControlUnion[]>([]);

  const controlTypes = [
    'canny', 'depth', 'pose', 'normal', 'semantic', 'scribble', 'lineart', 'mlsd', 'tile'
  ];

  const addControl = (type: 'lora' | 'net', controlType: string) => {
    const newControl: ControlItem = {
      id: Date.now().toString(),
      name: `${controlType}_${Date.now()}`,
      type: controlType,
      strength: 1.0,
      startStep: 0,
      endStep: 1000
    };

    if (type === 'lora') {
      setControlLoras([...controlLoras, newControl]);
    } else {
      setControlNets([...controlNets, newControl]);
    }
  };

  const removeControl = (type: 'lora' | 'net', id: string) => {
    if (type === 'lora') {
      setControlLoras(controlLoras.filter(item => item.id !== id));
    } else {
      setControlNets(controlNets.filter(item => item.id !== id));
    }
  };

  const updateControl = (type: 'lora' | 'net', id: string, field: string, value: any) => {
    const updateFn = (items: ControlItem[]) => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );

    if (type === 'lora') {
      setControlLoras(updateFn(controlLoras));
    } else {
      setControlNets(updateFn(controlNets));
    }
  };

  const addControlUnion = () => {
    const newUnion: ControlUnion = {
      id: Date.now().toString(),
      name: `Union_${Date.now()}`,
      controls: [],
      mode: 'balanced'
    };
    setControlUnions([...controlUnions, newUnion]);
  };

  const ControlItemComponent = ({ 
    item, 
    type, 
    onUpdate, 
    onRemove 
  }: { 
    item: ControlItem; 
    type: 'lora' | 'net'; 
    onUpdate: (field: string, value: any) => void;
    onRemove: () => void;
  }) => (
    <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">{item.name}</h4>
          <Badge variant="secondary" className="mt-1 bg-blue-500/20 text-blue-300">
            {item.type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-300 text-sm">Strength: {item.strength}</Label>
          <Slider
            value={[item.strength]}
            onValueChange={(value) => onUpdate('strength', value[0])}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-sm">Start Step: {item.startStep}</Label>
          <Slider
            value={[item.startStep]}
            onValueChange={(value) => onUpdate('startStep', value[0])}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-300 text-sm">End Step: {item.endStep}</Label>
          <Slider
            value={[item.endStep]}
            onValueChange={(value) => onUpdate('endStep', value[0])}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-sm">Control Image</Label>
          <Input
            type="file"
            accept="image/*"
            className="bg-slate-800 border-slate-600 text-white text-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Control Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="control-loras" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="control-loras">Control LoRAs</TabsTrigger>
            <TabsTrigger value="controlnets">ControlNets</TabsTrigger>
            <TabsTrigger value="unions">ControlNet Unions</TabsTrigger>
          </TabsList>

          <TabsContent value="control-loras" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">Control LoRAs</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>LoRA adapters for structural control</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={(value) => addControl('lora', value)}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Add Control LoRA" />
                </SelectTrigger>
                <SelectContent>
                  {controlTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {controlLoras.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Grid className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No Control LoRAs added</p>
                </div>
              ) : (
                controlLoras.map((item) => (
                  <ControlItemComponent
                    key={item.id}
                    item={item}
                    type="lora"
                    onUpdate={(field, value) => updateControl('lora', item.id, field, value)}
                    onRemove={() => removeControl('lora', item.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="controlnets" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">ControlNets</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Neural networks for precise image control</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={(value) => addControl('net', value)}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Add ControlNet" />
                </SelectTrigger>
                <SelectContent>
                  {controlTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {controlNets.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No ControlNets added</p>
                </div>
              ) : (
                controlNets.map((item) => (
                  <ControlItemComponent
                    key={item.id}
                    item={item}
                    type="net"
                    onUpdate={(field, value) => updateControl('net', item.id, field, value)}
                    onRemove={() => removeControl('net', item.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="unions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">ControlNet Unions</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Combine multiple ControlNets for complex control</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button 
                onClick={addControlUnion}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Union
              </Button>
            </div>

            <div className="space-y-3">
              {controlUnions.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Grid className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No ControlNet Unions created</p>
                </div>
              ) : (
                controlUnions.map((union) => (
                  <div key={union.id} className="p-3 bg-slate-900/30 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{union.name}</h4>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {union.mode}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Union configuration interface coming soon...
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ControlSection;
