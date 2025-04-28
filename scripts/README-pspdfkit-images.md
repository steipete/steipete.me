# PSPDFKit Images Reorganization

This document explains the process of reorganizing PSPDFKit images into the main blog image structure.

## Background

The blog previously used two separate directory structures for images:

1. Main blog images: `/public/assets/img/YEAR/post-name/`
2. PSPDFKit images: `/public/assets/img/pspdfkit/YEAR/post-name/`

To simplify the image organization and remove the separate PSPDFKit directory, all images were moved to follow the main blog pattern.

## Reorganization Process

The `reorganize-pspdfkit-images.sh` script was used to perform the following operations:

1. Find all images in the PSPDFKit directory structure
2. Create matching directories in the main image structure 
3. Copy all images to their new locations
4. Update image references in markdown files to point to the new locations
5. Remove the original PSPDFKit directory

## Results

- All PSPDFKit images were successfully moved to the main image directory structure
- Image references in blog posts were updated to use the new paths
- A log of all moved images was created at `scripts/pspdfkit-images-moved.txt`

## Future Maintenance

When working with blog images in the future:

1. All new images should be placed in `/public/assets/img/YEAR/post-name/`
2. All image references in markdown files should use the path format `/assets/img/YEAR/post-name/image.jpg`