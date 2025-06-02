# Website Compression Verification Guide

This guide provides multiple methods to verify that compression is working correctly on your website, including how to check which compression method is being used and whether pre-compressed files are being served.

## Key Headers to Look For

When verifying compression, these are the main response headers to check:

- **`Content-Encoding`**: Indicates which compression algorithm was used (gzip, br, deflate)
- **`Vary: Accept-Encoding`**: Shows the server can serve different versions based on client capabilities
- **`Content-Length`**: The size of the compressed response
- **`ETag`**: Can indicate if pre-compressed files are being served (may include compression suffix)

## Method 1: Using curl Commands

### Check for Gzip Compression

```bash
# Basic gzip test
curl -H "Accept-Encoding: gzip" -I https://steipete.me

# Verbose output to see full request/response
curl -H "Accept-Encoding: gzip" -v https://steipete.me 2>&1 | grep -i "content-encoding\|content-length"

# Download and check file size comparison
curl https://steipete.me -o uncompressed.html
curl -H "Accept-Encoding: gzip" https://steipete.me -o compressed.html.gz
ls -lh uncompressed.html compressed.html.gz
```

### Check for Brotli Compression

```bash
# Test for Brotli support
curl -H "Accept-Encoding: br" -I https://steipete.me

# Check with multiple encoding preferences
curl -H "Accept-Encoding: br, gzip, deflate" -v https://steipete.me 2>&1 | grep -i "content-encoding"
```

### Check Specific File Types

```bash
# Check CSS file compression
curl -H "Accept-Encoding: br, gzip" -I https://steipete.me/style.css

# Check JavaScript compression
curl -H "Accept-Encoding: br, gzip" -I https://steipete.me/script.js

# Check if pre-compressed files are served (look for consistent ETags)
curl -I https://steipete.me/style.css
curl -H "Accept-Encoding: gzip" -I https://steipete.me/style.css
curl -H "Accept-Encoding: br" -I https://steipete.me/style.css
```

### Comprehensive Compression Test Script

```bash
#!/bin/bash
URL="https://steipete.me"

echo "Testing compression for $URL"
echo "================================"

# Test without compression
echo -e "\n1. Without compression:"
SIZE_UNCOMPRESSED=$(curl -s -w "%{size_download}" -o /dev/null $URL)
echo "Size: $SIZE_UNCOMPRESSED bytes"

# Test with gzip
echo -e "\n2. With gzip:"
RESPONSE=$(curl -s -H "Accept-Encoding: gzip" -w "\nSize: %{size_download} bytes" -D - $URL -o /dev/null)
echo "$RESPONSE" | grep -i "content-encoding"
echo "$RESPONSE" | tail -1

# Test with brotli
echo -e "\n3. With brotli:"
RESPONSE=$(curl -s -H "Accept-Encoding: br" -w "\nSize: %{size_download} bytes" -D - $URL -o /dev/null)
echo "$RESPONSE" | grep -i "content-encoding"
echo "$RESPONSE" | tail -1

# Calculate compression ratio
if [ $SIZE_UNCOMPRESSED -gt 0 ]; then
    RATIO=$(echo "scale=2; (1 - $SIZE_COMPRESSED / $SIZE_UNCOMPRESSED) * 100" | bc)
    echo -e "\nCompression ratio: ~$RATIO%"
fi
```

## Method 2: Browser Developer Tools

### Chrome/Edge DevTools

1. Open DevTools (F12 or right-click → Inspect)
2. Go to the **Network** tab
3. Reload the page (Ctrl/Cmd + R)
4. Click on any resource (HTML, CSS, JS file)
5. Check the **Response Headers** section for:
   - `content-encoding` header
   - `content-length` (compressed size)
6. Look at the **Size** column:
   - Shows two values: `compressed size / actual size`
   - Example: `2.5 KB / 10.2 KB`

### Firefox DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for the **Transferred** column (shows compressed size)
5. Click on a resource and check **Response Headers**
6. Firefox also shows a compression indicator icon next to compressed resources

### Safari Web Inspector

1. Enable Developer menu (Preferences → Advanced → Show Develop menu)
2. Open Web Inspector (Develop → Show Web Inspector)
3. Go to **Network** tab
4. Reload and check **Transfer Size** vs **Resource Size**

## Method 3: Online Compression Testing Tools

### 1. GIDNetwork Compression Test
- URL: https://www.gidnetwork.com/tools/gzip-test.php
- Enter your URL and it shows:
  - Whether compression is enabled
  - Compression type (gzip/brotli)
  - Original vs compressed size
  - Compression percentage

### 2. GTmetrix
- URL: https://gtmetrix.com
- Provides detailed performance analysis including:
  - Compression status for all resources
  - Recommendations for uncompressed files
  - Compression savings potential

### 3. WebPageTest
- URL: https://www.webpagetest.org
- Advanced testing with:
  - Detailed request/response headers
  - Compression analysis per resource
  - Waterfall chart showing transfer sizes

### 4. Chrome Lighthouse
```bash
# Run from command line
npm install -g lighthouse
lighthouse https://steipete.me --view

# Or use Chrome DevTools
# 1. Open DevTools → Lighthouse tab
# 2. Run audit
# 3. Check "Enable text compression" in Opportunities
```

## Method 4: Verifying Pre-compressed Files

### Check if Static Files Exist

```bash
# On your server, check for pre-compressed files
ls -la dist/*.gz
ls -la dist/*.br

# Should see files like:
# index.html
# index.html.gz
# index.html.br
# style.css
# style.css.gz
# style.css.br
```

### Verify Pre-compressed Files Are Served

1. **Check ETag consistency**:
```bash
# ETags should be different for different encodings if serving pre-compressed
curl -s -I https://steipete.me/style.css | grep -i etag
curl -s -H "Accept-Encoding: gzip" -I https://steipete.me/style.css | grep -i etag
curl -s -H "Accept-Encoding: br" -I https://steipete.me/style.css | grep -i etag
```

2. **Check response time** (pre-compressed files serve faster):
```bash
# Time the responses
time curl -H "Accept-Encoding: gzip" https://steipete.me -o /dev/null
time curl -H "Accept-Encoding: br" https://steipete.me -o /dev/null
```

3. **Server logs** (if you have access):
```bash
# Check access logs to see which files are actually served
tail -f /var/log/nginx/access.log | grep -E "\.(gz|br)"
```

## Understanding Compression Priorities

Most modern servers follow this priority:
1. **Brotli** (br) - If client supports and file exists
2. **Gzip** - If client supports and file exists
3. **Uncompressed** - Fallback

### Testing Priority

```bash
# Force specific encoding to test server behavior
curl -H "Accept-Encoding: br" -I https://steipete.me        # Should get br
curl -H "Accept-Encoding: gzip" -I https://steipete.me      # Should get gzip
curl -H "Accept-Encoding: deflate" -I https://steipete.me   # Might get deflate or gzip
curl -I https://steipete.me                                 # No compression
```

## Troubleshooting Common Issues

### Compression Not Working

1. **Check Accept-Encoding header is sent**:
```bash
curl -v https://steipete.me 2>&1 | grep -i "accept-encoding"
```

2. **Verify server configuration**:
- Nginx: Check `gzip on;` and `brotli on;` directives
- Apache: Verify `mod_deflate` or `mod_brotli` are enabled
- CDN: Check compression settings in CDN dashboard

3. **File type restrictions**:
```bash
# Some servers only compress specific MIME types
curl -H "Accept-Encoding: gzip" -I https://steipete.me/image.jpg  # Usually not compressed
curl -H "Accept-Encoding: gzip" -I https://steipete.me/data.json  # Should be compressed
```

### Pre-compressed Files Not Served

1. **Check file permissions**:
```bash
ls -la dist/*.gz dist/*.br
# Files should be readable by web server
```

2. **Verify server configuration**:
```nginx
# Nginx example
gzip_static on;
brotli_static on;
```

3. **Test with curl verbose mode**:
```bash
curl -H "Accept-Encoding: gzip" -v https://steipete.me 2>&1
# Look for server processing in the output
```

## Quick Verification Checklist

- [ ] Content-Encoding header present (gzip or br)
- [ ] Compressed size is smaller than original
- [ ] Vary: Accept-Encoding header is present
- [ ] All text-based resources are compressed (HTML, CSS, JS, JSON, XML, SVG)
- [ ] Brotli is preferred over gzip when available
- [ ] Pre-compressed files are served (consistent fast response times)
- [ ] No compression errors in server logs
- [ ] Compression works for both HTTP and HTTPS

## Example Output Analysis

### Good Compression Response:
```
HTTP/2 200
content-type: text/html; charset=utf-8
content-encoding: br
vary: Accept-Encoding
content-length: 2547
etag: "abc123-br"
```

### No Compression:
```
HTTP/2 200
content-type: text/html; charset=utf-8
content-length: 10234
etag: "abc123"
```

This indicates compression is not working - no content-encoding header and larger content-length.