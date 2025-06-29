# AI Image Generation Server

This script launches a FastAPI-based web server for advanced image generation using Stable Diffusion models. It provides multiple endpoints for text-to-image, image-to-image, inpainting, and ControlNet-guided generation. A key feature is its ability to use the Mistral AI API to automatically select and apply the best LoRA models for a given prompt.

## Features

- **Multiple Generation Modes**:
  - Text-to-Image (`/generate-image/`)
  - Image-to-Image (`/generate-img2img-image/`)
  - Inpainting (`/generate-image-inpainting/`)
- **ControlNet Support**: Use control images to guide generation for precise results.
- **Multiple Model Support**:
  - `runwayml/stable-diffusion-v1-5`
  - `stabilityai/stable-diffusion-xl-base-1.0`
  - Distilled (faster) versions of both SD1.5 and SDXL.
- **Automatic LoRA Selection**:
  - An endpoint (`/generate-image-automatic`) that uses Mistral AI to analyze a prompt.
  - Intelligently selects the best LoRA from a predefined list to match the desired style.
  - Automatically adds LoRA trigger words to the prompt.
- **Dynamic Resource Management**:
  - Loads models to the GPU on-demand to conserve VRAM.
  - Endpoints to dynamically load/unload ControlNets and LoRAs.
- **System Monitoring**: A `/stats` endpoint to check CPU, RAM, and GPU usage.
- **Ngrok Integration**: Automatically exposes the local server to the internet with a public URL.

## API Endpoints

### Image Generation

- **POST `/generate-image/`**: Text-to-image generation. Can be combined with ControlNet.
- **POST `/generate-image-inpainting/`**: Inpaints an image using a mask.
- **POST `/generate-img2img-image/`**: Performs image-to-image translation.
- **POST `/generate-image-automatic`**: Text-to-image generation with automatic LoRA selection via Mistral AI.

### Model Management

- **POST `/load-controlnet/`**: Loads a ControlNet model into memory.
- **DELETE `/unload-controlnet/`**: Unloads a ControlNet model to free VRAM.
- **POST `/load-lora/`**: Loads a LoRA model and applies it to the pipeline.

### Utilities

- **GET `/stats`**: Get real-time server resource usage (CPU, RAM, GPU).
- **GET `/pipeline-state/`**: Check the current state of the diffusion pipeline.
- **GET `/active-controlnets/`**: Lists the currently loaded ControlNet models.

## Setup and Installation

1.  **Install Dependencies**:
    ```bash
    pip install fastapi uvicorn diffusers transformers peft accelerate torch safetensors mistralai pyngrok
    ```

2.  **Set Environment Variables**:
    For the automatic LoRA selection feature, you need a Mistral API key.
    ```bash
    export MISTRAL_API_KEY='YOUR_MISTRAL_API_KEY'
    ```

3.  **Run the Server**:
    ```bash
    python mid_eval.py
    ```
    The script will start a `uvicorn` server and print a public `ngrok` URL to the console.

## How to Use

You can interact with the API endpoints using any HTTP client, like `curl` or Python's `requests` library.

**Example: Text-to-Image Generation**
```bash
curl -X POST -F "prompt=a majestic lion" -F "height=512" -F "width=512" -F "num_inference_steps=20" -F "guidance_scale=7.5" -F "model=SD1.5_Base" http://<your-ngrok-url>/generate-image/ --output output.png
```
