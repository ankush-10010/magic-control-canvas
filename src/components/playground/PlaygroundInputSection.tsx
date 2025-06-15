
import { Settings, Activity, Layers, Grid3X3 } from "lucide-react";
import PromptInput from "../PromptInput";
import GenerationControls from "../GenerationControls";
import PipelineStatusPanel from "../PipelineStatusPanel";
import LoraSection from "../LoraSection";
import ControlNetManager from "../ControlNetManager";
import GenerateButton from "../GenerateButton";
import CollapsibleControls from "../CollapsibleControls";
import EnhancedCollapsibleSection from "./EnhancedCollapsibleSection";
import { useSectionManager } from "./SectionManager";

interface PlaygroundInputSectionProps {
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
  showSuccess: boolean;
  onGenerate: () => void;
  onError?: (message: string) => void;
}

const PlaygroundInputSection = ({
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
  showSuccess,
  onGenerate,
  onError
}: PlaygroundInputSectionProps) => {
  const {
    openSections,
    handleExpandAll,
    handleCollapseAll,
    toggleSection,
    openSectionCount
  } = useSectionManager();

  return (
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
          isOpen={openSections.controls}
          onToggle={() => toggleSection('controls')}
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
          isOpen={openSections.pipeline}
          onToggle={() => toggleSection('pipeline')}
        >
          <PipelineStatusPanel onError={onError} />
        </EnhancedCollapsibleSection>

        <EnhancedCollapsibleSection
          sectionKey="loras"
          title="LoRAs"
          icon={<Layers className="w-5 h-5" />}
          isOpen={openSections.loras}
          onToggle={() => toggleSection('loras')}
        >
          <LoraSection onError={onError} />
        </EnhancedCollapsibleSection>
        
        <EnhancedCollapsibleSection
          sectionKey="controlnet"
          title="ControlNet Manager"
          icon={<Grid3X3 className="w-5 h-5" />}
          isOpen={openSections.controlnet}
          onToggle={() => toggleSection('controlnet')}
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
  );
};

export default PlaygroundInputSection;
