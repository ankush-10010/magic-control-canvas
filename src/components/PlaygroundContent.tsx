
import PlaygroundInputSection from "./playground/PlaygroundInputSection";
import PlaygroundResultSection from "./playground/PlaygroundResultSection";

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <PlaygroundInputSection
        prompt={prompt}
        onPromptChange={onPromptChange}
        controlImage={controlImage}
        onControlImageChange={onControlImageChange}
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
        isGenerating={isGenerating}
        showSuccess={showSuccess}
        onGenerate={onGenerate}
        onError={onError}
      />

      {/* Result Section */}
      <PlaygroundResultSection
        isGenerating={isGenerating}
        generatedImage={generatedImage}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
    </div>
  );
};

export default PlaygroundContent;
