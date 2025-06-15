
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { backendConfig, getApiUrl } from "@/config/backend";

export const useImageGeneration = () => {
  const [prompt, setPrompt] = useState("Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Generation parameters
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numInferenceSteps, setNumInferenceSteps] = useState(20);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [controlImage, setControlImage] = useState<File | null>(null);
  const [loraScales, setLoraScales] = useState<Record<string, number>>({});
  
  const { toast } = useToast();

  const handleGenerate = async (addError: (message: string) => void) => {
    if (!prompt.trim()) {
      addError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      console.log("Sending request to backend...");
      
      // Create FormData for multipart request
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('height', height.toString());
      formData.append('width', width.toString());
      formData.append('num_inference_steps', numInferenceSteps.toString());
      formData.append('guidance_scale', guidanceScale.toString());
      
      // Add control image if selected
      if (controlImage) {
        formData.append('control_image', controlImage);
      }
      
      // Add LoRA scales if any
      if (Object.keys(loraScales).length > 0) {
        formData.append('lora_scales', JSON.stringify(loraScales));
      }

      const response = await fetch(getApiUrl('/generate-image/'), {
        method: 'POST',
        headers: backendConfig.headers,
        body: formData
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convert response to blob
      const imageBlob = await response.blob();
      console.log("Image blob received, size:", imageBlob.size);
      
      // Create object URL from blob
      const imageUrl = URL.createObjectURL(imageBlob);
      console.log("Image URL created:", imageUrl);
      setGeneratedImage(imageUrl);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

    } catch (error) {
      console.error('Error generating image:', error);
      addError("Failed to generate image. Make sure your backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", e);
    toast({
      title: "Error",
      description: "Failed to display the generated image",
      variant: "destructive",
    });
  };

  return {
    // State
    prompt,
    isGenerating,
    generatedImage,
    showSuccess,
    width,
    height,
    numInferenceSteps,
    guidanceScale,
    controlImage,
    loraScales,
    
    // Setters
    setPrompt,
    setWidth,
    setHeight,
    setNumInferenceSteps,
    setGuidanceScale,
    setControlImage,
    setLoraScales,
    
    // Handlers
    handleGenerate,
    handleImageLoad,
    handleImageError
  };
};
