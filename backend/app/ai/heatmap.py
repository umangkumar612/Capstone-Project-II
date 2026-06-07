from __future__ import annotations

from pathlib import Path

import numpy as np


def create_gradcam_style_heatmap(source: Path, destination: Path) -> Path:
    """Create a Grad-CAM-style overlay for explainability workflows."""
    if source.suffix.lower() == ".dcm":
        return _create_dicom_heatmap(source, destination)

    try:
        import cv2

        image = cv2.imread(str(source))
        if image is None:
            raise ValueError("Unreadable image")
        image = cv2.resize(image, (512, 512))
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (41, 41), 0)
        normalized = cv2.normalize(blurred, None, 0, 255, cv2.NORM_MINMAX)
        heatmap = cv2.applyColorMap(normalized.astype("uint8"), cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(image, 0.62, heatmap, 0.38, 0)
        cv2.imwrite(str(destination), overlay)
        return destination
    except Exception:
        from PIL import Image, ImageFilter

        image = Image.open(source).convert("RGB").resize((512, 512))
        gray = image.convert("L").filter(ImageFilter.GaussianBlur(radius=18))
        heat = np.asarray(gray).astype("float32")
        heat = (heat - heat.min()) / max(1.0, heat.max() - heat.min())
        red = (255 * heat).astype("uint8")
        blue = (255 * (1 - heat)).astype("uint8")
        overlay = np.dstack([red, np.zeros_like(red), blue])
        blended = Image.blend(image, Image.fromarray(overlay, "RGB"), 0.38)
        blended.save(destination)
        return destination


def _create_dicom_heatmap(source: Path, destination: Path) -> Path:
    import pydicom
    from PIL import Image, ImageFilter

    dataset = pydicom.dcmread(str(source))
    pixels = dataset.pixel_array.astype("float32")
    pixels = pixels - pixels.min()
    pixels = pixels / max(1.0, pixels.max())
    grayscale = (pixels * 255).astype("uint8")
    image = Image.fromarray(grayscale).convert("RGB").resize((512, 512))
    blurred = Image.fromarray(grayscale).resize((512, 512)).filter(ImageFilter.GaussianBlur(radius=18))
    heat = np.asarray(blurred).astype("float32") / 255.0
    red = (255 * heat).astype("uint8")
    blue = (255 * (1 - heat)).astype("uint8")
    overlay = np.dstack([red, np.zeros_like(red), blue])
    blended = Image.blend(image, Image.fromarray(overlay, "RGB"), 0.38)
    blended.save(destination)
    return destination
