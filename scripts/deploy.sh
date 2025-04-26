#!/bin/bash

# Deploy script for Peter Steinberger's personal website
# This script builds the site and deploys it to Vercel

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit

# Colors for prettier output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Step 1: Check if git is clean
if [[ $(git status --porcelain) ]]; then
  echo -e "${RED}Error: Git working directory is not clean.${NC}"
  echo -e "${RED}Please commit or stash your changes before deploying.${NC}"
  exit 1
fi

# Step 2: Import posts (if needed)
read -p "Do you want to import posts from GitHub repositories? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Importing posts...${NC}"
  npm run import-posts
  
  # Check if new posts were added
  if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}New posts were imported. Committing changes...${NC}"
    git add src/content/blog/
    git commit -m "Import posts from GitHub repositories"
  else
    echo -e "${GREEN}No new posts were imported.${NC}"
  fi
fi

# Step 3: Build the site
echo -e "${YELLOW}Building the site...${NC}"
npm run build

# Step 4: Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Error: Vercel CLI is not installed.${NC}"
  echo -e "${YELLOW}Installing Vercel CLI...${NC}"
  npm install -g vercel
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to production...${NC}"
vercel --prod

echo -e "${GREEN}Deployment completed successfully!${NC}"