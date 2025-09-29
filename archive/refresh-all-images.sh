#!/bin/bash

# Script to refresh all images from live Ghost site with cache-busting
# This ensures we get the latest/correct version of every image

echo "🔄 Starting comprehensive image refresh..."
echo "📊 Total images to refresh: $(wc -l < /tmp/all_image_paths.txt)"
echo ""

# Create a log file
LOG_FILE="image-refresh.log"
echo "Starting image refresh at $(date)" > $LOG_FILE

# Counter
SUCCESS_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0

# Read each image path and download
while IFS= read -r image_path; do
    # Remove leading slash and convert to local path
    local_path="public${image_path}"
    
    # Create directory structure if it doesn't exist
    mkdir -p "$(dirname "$local_path")"
    
    # Convert to URL (rahulpnath.com)
    url="https://www.rahulpnath.com${image_path}"
    
    echo "📥 Downloading: $image_path"
    
    # Download with cache-busting headers
    if curl -H "Cache-Control: no-cache" -H "Pragma: no-cache" -L -f -o "$local_path" "$url" 2>/dev/null; then
        echo "✅ Success: $image_path" >> $LOG_FILE
        ((SUCCESS_COUNT++))
    else
        echo "❌ Failed: $image_path" >> $LOG_FILE
        echo "   URL: $url" >> $LOG_FILE
        ((ERROR_COUNT++))
    fi
    
    # Show progress every 50 images
    if (( (SUCCESS_COUNT + ERROR_COUNT) % 50 == 0 )); then
        echo "📈 Progress: $((SUCCESS_COUNT + ERROR_COUNT))/$(wc -l < /tmp/all_image_paths.txt) processed"
    fi
    
done < /tmp/all_image_paths.txt

echo ""
echo "🎉 Image refresh complete!"
echo "✅ Successfully downloaded: $SUCCESS_COUNT"
echo "❌ Failed downloads: $ERROR_COUNT" 
echo "📋 Full log saved to: $LOG_FILE"
echo ""
echo "🔍 To see failed downloads:"
echo "   grep '❌' $LOG_FILE"