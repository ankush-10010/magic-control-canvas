
import { TabsContent } from "@/components/ui/tabs";
import PlaygroundContent from "@/components/PlaygroundContent";
import DocumentationPanel from "@/components/DocumentationPanel";
import SystemDashboard from "@/components/SystemDashboard";

interface TabContentProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  controlImage: File | null;
  onControlImageChange: (file: File | null) => void;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  loraScales: Record<string, number>;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onGuidanceScaleChange: (value: number) => void;
  onLoraScalesChange: (scales: Record<string, number>) => void;
  isGenerating: boolean;
  generatedImage: string | null;
  showSuccess: boolean;
  onGenerate: () => void;
  onImageLoad: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError: (message: string) => void;
}

const TabContent = ({
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
}: TabContentProps) => {
  return (
    <>
      <TabsContent value="playground" className="space-y-4">
        <PlaygroundContent
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
          generatedImage={generatedImage}
          showSuccess={showSuccess}
          onGenerate={onGenerate}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
          onError={onError}
        />
      </TabsContent>

      <TabsContent value="documentation" className="space-y-4">
        <DocumentationPanel />
      </TabsContent>

      <TabsContent value="dashboard" className="space-y-4">
        <SystemDashboard />
      </TabsContent>
    </>
  );
};

export default TabContent;
