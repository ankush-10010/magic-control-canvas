import { useState, useRef } from 'react';
import { Settings, Activity, Layers, Grid3X3 } from "lucide-react";
import PromptInput from "./PromptInput";
import GenerationControls from "./GenerationControls";
import PipelineStatusPanel from "./PipelineStatusPanel";
import LoraSection from "./LoraSection";
import ControlNetManager from "./ControlNetManager";
import GenerateButton from "./GenerateButton";
import ImageDisplay from "./ImageDisplay";
import CollapsibleSection from "./CollapsibleSection";
import CollapsibleControls from "./CollapsibleControls";

interface PlaygroundContentProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  controlImage: File | null;
  onControlImageChange: (file: File | null) => void;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  loraScales: Record<string, number>;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onStepsChange: (steps: number) => void;
  onGuidanceScaleChange: (scale: number) => void;
  onLoraScalesChange: (scales: Record<string, number>) => void;
  isGenerating: boolean;
  generatedImage: string | null;
  showSuccess: boolean;
  onGenerate: () => void;
  onImageLoad: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (message: string) => void;
}

const PlaygroundContent = ({
  prompt,
  onPromptChange,
  controlImage,
  onControlImageChange,
  width,
  height,
  numInferenceSteps,
  guidanceScale,
  loraScales,
  onWidthChange,
  onHeightChange,
  onStepsChange,
  onGuidanceScaleChange,
  onLoraScalesChange,
  isGenerating,
  generatedImage,
  showSuccess,
  onGenerate,
  onImageLoad,
  onImageError,
  onError
}: PlaygroundContentProps) => {
  const [openSections, setOpenSections] = useState({
    controls: false,
    pipeline: false,
    loras: false,
    controlnet: false
  });

  const sectionRefs = {
    controls: useRef<{ setOpen: (open: boolean) => void }>(null),
    pipeline: useRef<{ setOpen: (open: boolean) => void }>(null),
    loras: useRef<{ setOpen: (open: boolean) => void }>(null),
    controlnet: useRef<{ setOpen: (open: boolean) => void }>(null)
  };

  const handleExpandAll = () => {
    setOpenSections({
      controls: true,
      pipeline: true,
      loras: true,
      controlnet: true
    });
  };

  const handleCollapseAll = () => {
    setOpenSections({
      controls: false,
      pipeline: false,
      loras: false,
      controlnet: false
    });
  };

  const openSectionCount = Object.values(openSections).filter(Boolean).length;

  // Enhanced CollapsibleSection that exposes setOpen method
  const EnhancedCollapsibleSection = ({ 
    sectionKey, 
    title, 
    icon, 
    children, 
    className = "" 
  }: {
    sectionKey: keyof typeof openSections;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isOpen = openSections[sectionKey];
    
    const toggleSection = () => {
      setOpenSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    };

    return (
      <CollapsibleSection
        title={title}
        icon={icon}
        defaultOpen={isOpen}
        className={className}
        onToggle={toggleSection}
        isOpen={isOpen}
      >
        {children}
      </CollapsibleSection>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-6">
        <PromptInput
          prompt={prompt}
          onPromptChange={onPromptChange}
          controlImage={controlImage}
          onControlImageChange={onControlImageChange}
        />

        <CollapsibleControls
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          openSections={openSectionCount}
          totalSections={4}
        />

        <div className="space-y-4 animate-in slide-in-from-left-2 duration-700">
          <EnhancedCollapsibleSection
            sectionKey="controls"
            title="Generation Controls"
            icon={<Settings className="w-5 h-5" />}
          >
            <GenerationControls
              width={width}
              height={height}
              numInferenceSteps={numInferenceSteps}
              guidanceScale={guidanceScale}
              loraScales={loraScales}
              onWidthChange={onWidthChange}
              onHeightChange={onHeightChange}
              onStepsChange={onStepsChange}
              onGuidanceScaleChange={onGuidanceScaleChange}
              onLoraScalesChange={onLoraScalesChange}
            />
          </EnhancedCollapsibleSection>

          <EnhancedCollapsibleSection
            sectionKey="pipeline"
            title="Pipeline Status"
            icon={<Activity className="w-5 h-5" />}
          >
            <PipelineStatusPanel onError={onError} />
          </EnhancedCollapsibleSection>

          <EnhancedCollapsibleSection
            sectionKey="loras"
            title="LoRAs"
            icon={<Layers className="w-5 h-5" />}
          >
            <LoraSection onError={onError} />
          </EnhancedCollapsibleSection>
          
          <EnhancedCollapsibleSection
            sectionKey="controlnet"
            title="ControlNet Manager"
            icon={<Grid3X3 className="w-5 h-5" />}
          >
            <ControlNetManager />
          </EnhancedCollapsibleSection>
        </div>

        <GenerateButton
          isGenerating={isGenerating}
          canGenerate={prompt.trim() !== ''}
          showSuccess={showSuccess}
          onGenerate={onGenerate}
        />
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <ImageDisplay
          isGenerating={isGenerating}
          generatedImage={generatedImage}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
        />
      </div>
    </div>
  );
};

export default PlaygroundContent;
