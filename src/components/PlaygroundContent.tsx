
import PromptInput from "./PromptInput";
import GenerationControls from "./GenerationControls";
import PipelineStatusPanel from "./PipelineStatusPanel";
import LoraSection from "./LoraSection";
import ControlNetManager from "./ControlNetManager";
import GenerateButton from "./GenerateButton";
import ImageDisplay from "./ImageDisplay";

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
  onImageError
}: PlaygroundContentProps) => {
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

        <div className="animate-in slide-in-from-left-2 duration-700 delay-100">
          <PipelineStatusPanel />
        </div>

        <div className="animate-in slide-in-from-left-2 duration-700 delay-200">
          <LoraSection />
        </div>
        
        <div className="animate-in slide-in-from-left-2 duration-700 delay-300">
          <ControlNetManager />
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
