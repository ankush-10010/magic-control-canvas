
import ImageDisplay from "../ImageDisplay";

interface PlaygroundResultSectionProps {
  isGenerating: boolean;
  generatedImage: string | null;
  onImageLoad: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const PlaygroundResultSection = ({
  isGenerating,
  generatedImage,
  onImageLoad,
  onImageError
}: PlaygroundResultSectionProps) => {
  return (
    <div className="space-y-6">
      <ImageDisplay
        isGenerating={isGenerating}
        generatedImage={generatedImage}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
    </div>
  );
};

export default PlaygroundResultSection;
