from __future__ import annotations

from pathlib import Path
from typing import Tuple

import numpy as np

IMAGE_SIZE: Tuple[int, int] = (224, 224)


def load_and_preprocess_image(image_path: Path) -> np.ndarray:
    """Load an image, denoise, resize, and normalize pixels for CNN inference."""
    if image_path.suffix.lower() == ".dcm":
        image = _load_dicom(image_path)
        normalized = image.astype("float32") / 255.0
        return np.expand_dims(normalized, axis=0)

    try:
        import cv2

        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError("Unsupported or unreadable image file")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.fastNlMeansDenoisingColored(image, None, 8, 8, 7, 21)
        image = cv2.resize(image, IMAGE_SIZE)
    except Exception:
        from PIL import Image, ImageFilter

        pil_image = Image.open(image_path).convert("RGB")
        pil_image = pil_image.filter(ImageFilter.MedianFilter(size=3))
        pil_image = pil_image.resize(IMAGE_SIZE)
        image = np.asarray(pil_image)

    normalized = image.astype("float32") / 255.0
    return np.expand_dims(normalized, axis=0)


def _load_dicom(image_path: Path) -> np.ndarray:
    import pydicom
    from PIL import Image, ImageFilter

    dataset = pydicom.dcmread(str(image_path))
    pixels = dataset.pixel_array.astype("float32")
    pixels = pixels - pixels.min()
    pixels = pixels / max(1.0, pixels.max())
    pixels = (pixels * 255).astype("uint8")
    image = Image.fromarray(pixels).convert("RGB")
    image = image.filter(ImageFilter.MedianFilter(size=3))
    image = image.resize(IMAGE_SIZE)
    return np.asarray(image)


def image_statistics(batch: np.ndarray) -> dict:
    image = batch[0]
    grayscale = image.mean(axis=2)
    gradient_y, gradient_x = np.gradient(grayscale)
    return {
        "brightness": float(grayscale.mean()),
        "contrast": float(grayscale.std()),
        "edge_density": float(np.abs(gradient_x).mean() + np.abs(gradient_y).mean()),
    }
