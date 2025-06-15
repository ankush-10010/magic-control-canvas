
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlaygroundContent from "@/components/PlaygroundContent";
import DocumentationPanel from "@/components/DocumentationPanel";

interface TabContentProps {
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
      <TabsContent value="playground" className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
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
    </>
  );
};

export default TabContent;
