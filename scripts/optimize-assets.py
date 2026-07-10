"""Generate deterministic display-sized WebP assets for the personal site."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def write_webp(source: str, target: str, width: int, quality: int = 84) -> None:
    source_path = ROOT / source
    target_path = ROOT / target
    target_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as image:
        image = image.convert("RGBA")
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(
            target_path,
            "WEBP",
            quality=quality,
            method=6,
            exact=True,
        )

    size_kb = target_path.stat().st_size / 1024
    print(f"{target}: {width}x{height}, {size_kb:.1f}KB")


def main() -> None:
    for width in (480, 800, 1200):
        write_webp(
            "assets/portrait/portrait-cutout.png",
            f"assets/portrait/portrait-{width}.webp",
            width,
            quality=82,
        )

    logo_jobs = (
        ("logo-hnu.png", "logo-hnu.webp", 240),
        ("logo-cuhksz.png", "logo-cuhksz.webp", 240),
        ("logo-pku-institute.png", "logo-pku-institute.webp", 460),
        ("logo-bytedance.png", "logo-bytedance.webp", 360),
    )
    for source, target, width in logo_jobs:
        write_webp(
            f"assets/logos/{source}",
            f"assets/logos/{target}",
            width,
            quality=88,
        )


if __name__ == "__main__":
    main()
