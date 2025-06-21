# Documentation for `working_cn_lora.py`

## Overview

This Python script implements a FastAPI backend for AI image generation using Stable Diffusion. It provides a flexible and powerful API to control the generation process, including support for ControlNet and LoRA models to allow for more fine-grained control over the output images.

The backend is designed to be used with a frontend application, as indicated by the CORS (Cross-Origin Resource Sharing) middleware, which allows requests from any origin.

## Features

-   **Stable Diffusion Pipeline**: Utilizes the `diffusers` library to build a powerful image generation pipeline. It's initialized with a base model (e.g., `runwayml/stable-diffusion-v1-5`), VAE, text encoder, tokenizer, UNet, and a DDIM scheduler.
-   **ControlNet Integration**:
    -   Dynamically load and unload ControlNet models.
    -   Apply ControlNet guidance by providing a control image during generation.
    -   Manage multiple active ControlNets.
-   **LoRA (Low-Rank Adaptation) Support**:
    -   Load LoRA weights into the pipeline to modify the style or content of the generated images.
    -   Ability to specify the LoRA scale (weight).
    -   Intelligently selects the LoRA file with the highest training step from a directory if multiple are present.
-   **Asynchronous API**: Built with FastAPI, providing a high-performance, asynchronous API.
-   **System Monitoring**: An endpoint to get real-time CPU and GPU statistics.
-   **Stateful Pipeline**: The server maintains the state of the loaded models (ControlNets, LoRAs) and the main pipeline.

## Pipeline Creation and Initialization

The script manages a single, primary pipeline that can be reconfigured on the fly based on user requests.

### Base Pipeline

Upon startup, the script initializes a `StableDiffusionControlNetPipeline` with components from a pretrained base model (default is `runwayml/stable-diffusion-v1-5`). The initial pipeline is configured to use `float16` precision for better performance and lower memory usage on compatible GPUs. Initially, no ControlNet is attached to this pipeline.

```python
# Base components are loaded first
vae = AutoencoderKL.from_pretrained(base_path, subfolder="vae", torch_dtype=torch.float16)
text_encoder = CLIPTextModel.from_pretrained(base_path, subfolder="text_encoder", torch_dtype=torch.float16)
tokenizer = CLIPTokenizer.from_pretrained(base_path, subfolder="tokenizer")
unet = UNet2DConditionModel.from_pretrained(base_path, subfolder="unet", torch_dtype=torch.float16)
scheduler = DDIMScheduler.from_pretrained(base_path, subfolder="scheduler")

# The initial pipeline is created without a ControlNet
pipe = StableDiffusionControlNetPipeline(
    vae=vae,
    text_encoder=text_encoder,
    tokenizer=tokenizer,
    unet=unet,
    scheduler=scheduler,
    safety_checker=None,
    feature_extractor=None,
    requires_safety_checker=False,
    controlnet=None,
).to("cuda")
```

### Dynamic Pipeline Reconstruction for Generation

The core logic for pipeline configuration resides within the `/generate-image/` endpoint. Before each generation task, the script checks the current state (loaded ControlNets, provided control images) and reconstructs the pipeline as needed.

1.  **With ControlNet and Control Image**: If a ControlNet model has been loaded via `/load-controlnet/` and a control image is provided in the generation request, a *new* `StableDiffusionControlNetPipeline` is created on-the-fly. This new pipeline instance includes the active `ControlNetModel`.

    ```python
    # Inside /generate-image/
    controlnet = ControlNetModel.from_pretrained(controlnet_path, torch_dtype=dtype).to("cuda")
    pipe = StableDiffusionControlNetPipeline(
        vae=vae, text_encoder=text_encoder, tokenizer=tokenizer,
        unet=unet, controlnet=controlnet, scheduler=scheduler,
        # ...
    ).to("cuda")
    ```

2.  **Without ControlNet**: If no ControlNet is active or no control image is supplied, the pipeline is re-created using the base components but with `controlnet=None`. This ensures that any previously used ControlNet is detached.

3.  **LoRA Weights**: When LoRA weights are loaded via `/load-lora/`, they are directly applied to the UNet of the *currently active pipeline instance* using `pipe.load_lora_weights()`. The pipeline itself is not reconstructed for this operation.

This dynamic approach ensures that the correct pipeline configuration is used for each specific generation request.

## API Endpoints

### `POST /load-controlnet/`

Loads a ControlNet model into memory. The parameters are stored but the model is only attached to the pipeline during a generation request that includes a control image.

-   **Parameters**:
    -   `controlnet_path` (str): The path or Hugging Face Hub ID of the ControlNet model.
    -   `adapter_name` (str, optional): A unique name to identify the model.
    -   `lora_weights_path` (str, optional): Required for ControlLoRA models.
    -   `torch_dtype` (str, optional): `float16` or `float32`. Defaults to `float16`.
-   **Returns**: A confirmation message.

### `POST /generate-image/`

Generates an image based on the provided parameters. This is the main endpoint of the application.

-   **Parameters**:
    -   `prompt` (str): The text prompt for the image generation.
    -   `height` (int): The height of the output image.
    -   `width` (int): The width of the output image.
    -   `num_inference_steps` (int): The number of denoising steps.
    -   `guidance_scale` (float): The classifier-free guidance scale.
    -   `control_image` (UploadFile, optional): An image file to be used by the ControlNet.
-   **Returns**: The generated image as a PNG file in the response body.

### `POST /load-lora/`

Loads and applies LoRA weights to the pipeline's UNet.

-   **Parameters**:
    -   `lora_path` (str): Path to the LoRA `.safetensors` file or a directory containing it. If it's a directory, it will try to find the file with the highest step count in its name.
    -   `adapter_name` (str, optional): A name for the LoRA adapter.
    -   `lora_scale` (float, optional): The weight/scale to apply the LoRA. Defaults to `1.0`.
-   **Returns**: A success message.

### `GET /active-controlnets/`

Lists the ControlNet models that are currently loaded in memory.

-   **Returns**: A list of the keys/names of the active ControlNets.

### `DELETE /unload-controlnet/`

Unloads a specific ControlNet model from memory to free up resources.

-   **Parameters**:
    -   `model_key` (str): The name or path of the model to unload.
-   **Returns**: A status message indicating success or failure.

### `GET /pipeline-state/`

Provides a snapshot of the current state of the generation pipeline.

-   **Returns**: A JSON object with details about the loaded pipeline, including base model, scheduler, and whether a ControlNet is attached.

### `GET /stats`

Retrieves system resource usage statistics.

-   **Returns**: A JSON object containing:
    -   `cpu_ram` (dict): `total`, `available`, `percent`, `used`, `free` memory.
    -   `gpu` (dict): For each GPU, `id`, `load`, `memoryTotal`, `memoryUsed`, `memoryFree`.

## How to Run

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt 
    # Or install individually:
    # pip install fastapi uvicorn "diffusers[torch]" transformers peft accelerate safetensors python-multipart
    ```
    *Note: Ensure you have a compatible version of PyTorch with CUDA support installed.*

2.  **Run the Server**:
    ```bash
    uvicorn working_cn_lora:app --host 0.0.0.0 --port 8000
    ```

The API will then be available at `http://localhost:8000`. You can access the auto-generated documentation at `http://localhost:8000/docs`. 