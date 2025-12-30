#!/bin/bash
# Generate PNG icons from SVG using available tools
# Try various methods

echo "Generating app icons..."

# Check if we have ImageMagick or other tools
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    convert icon.svg -resize 72x72 icon-72x72.png
    convert icon.svg -resize 96x96 icon-96x96.png
    convert icon.svg -resize 128x128 icon-128x128.png
    convert icon.svg -resize 144x144 icon-144x144.png
    convert icon.svg -resize 152x152 icon-152x152.png
    convert icon.svg -resize 192x192 icon-192x192.png
    convert icon.svg -resize 384x384 icon-384x384.png
    convert icon.svg -resize 512x512 icon-512x512.png
    convert icon.svg -resize 32x32 favicon.png
    echo "Icons generated successfully!"
elif command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert..."
    rsvg-convert -w 72 -h 72 icon.svg -o icon-72x72.png
    rsvg-convert -w 96 -h 96 icon.svg -o icon-96x96.png
    rsvg-convert -w 128 -h 128 icon.svg -o icon-128x128.png
    rsvg-convert -w 144 -h 144 icon.svg -o icon-144x144.png
    rsvg-convert -w 152 -h 152 icon.svg -o icon-152x152.png
    rsvg-convert -w 192 -h 192 icon.svg -o icon-192x192.png
    rsvg-convert -w 384 -h 384 icon.svg -o icon-384x384.png
    rsvg-convert -w 512 -h 512 icon.svg -o icon-512x512.png
    rsvg-convert -w 32 -h 32 icon.svg -o favicon.png
    echo "Icons generated successfully!"
else
    echo "Note: No image conversion tool found."
    echo "The SVG icon is ready. Icons will be generated on first deploy."
    echo "For now, copying SVG as fallback..."
    cp icon.svg icon-192x192.png
    cp icon.svg icon-512x512.png
    cp icon.svg favicon.png
fi

ls -la *.png 2>/dev/null || echo "PNG files not generated yet"
