#!/usr/bin/env python3
import os
import re
import glob
import sys
from pathlib import Path

def extract_frontmatter(content):
    """Extract frontmatter from blog post content."""
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match:
        return None, content
    
    frontmatter = match.group(1)
    content_without_frontmatter = content[match.end():]
    return frontmatter, content_without_frontmatter

def extract_description(frontmatter):
    """Extract description from frontmatter."""
    match = re.search(r'description:\s*(.*?)(?:\n[a-zA-Z]|\Z)', frontmatter, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def generate_description(content, title, existing_desc=None):
    """Generate a better description from the blog post content."""
    # Remove code blocks and other non-textual content
    content = re.sub(r'{%\s*gist.*?%}', '', content)
    content = re.sub(r'{%\s*twitter.*?%}', '', content)
    content = re.sub(r'<.*?>', '', content, flags=re.DOTALL)
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    
    # Get first few paragraphs
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    paragraphs = [p for p in paragraphs if not p.startswith('#') and len(p) > 30]
    
    if not paragraphs:
        return existing_desc or f"A blog post about {title.lower()}"
    
    # Take the first 2-3 sentences from the first paragraph
    first_para = paragraphs[0].replace('\n', ' ')
    sentences = re.split(r'(?<=[.!?])\s+', first_para)
    
    if len(sentences) <= 2:
        desc = first_para
    else:
        desc = ' '.join(sentences[:2])
        
    # If it's too short, add another sentence from the next paragraph
    if len(desc) < 100 and len(paragraphs) > 1:
        next_para = paragraphs[1].replace('\n', ' ')
        next_sentences = re.split(r'(?<=[.!?])\s+', next_para)
        if next_sentences:
            desc += ' ' + next_sentences[0]
    
    # Truncate if too long
    if len(desc) > 240:
        desc = desc[:237] + '...'
        
    # Fix any remaining issues
    desc = desc.replace("''", "'")
    desc = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', desc)  # Convert markdown links to plain text
    
    return desc

def process_file(file_path):
    """Process a single blog post file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    frontmatter, post_content = extract_frontmatter(content)
    if not frontmatter:
        print(f"Warning: Could not extract frontmatter from {file_path}")
        return
    
    # Extract title and existing description
    title_match = re.search(r'title:\s*(.*?)$', frontmatter, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Unknown Title"
    title = title.strip('"\'')
    
    # Remove quotes around title if present
    if (title.startswith("'") and title.endswith("'")) or (title.startswith('"') and title.endswith('"')):
        title = title[1:-1]
    
    existing_desc = extract_description(frontmatter)
    
    # Generate new description
    new_desc = generate_description(post_content, title, existing_desc)
    
    # Prepare the new description string with proper quotes
    if "'" in new_desc:
        new_desc_formatted = f'description: "{new_desc}"'
    else:
        new_desc_formatted = f"description: '{new_desc}'"
    
    # Replace the description in the frontmatter
    if existing_desc:
        # Try to match the description with its formatting
        desc_pattern = re.escape(existing_desc)
        updated_frontmatter = re.sub(
            r'description:\s*(.*?)(?=\n[a-zA-Z]|\n---|\Z)', 
            lambda m: new_desc_formatted, 
            frontmatter, 
            flags=re.DOTALL
        )
    else:
        # Add a new description field if one doesn't exist
        updated_frontmatter = frontmatter + f"\n{new_desc_formatted}"
    
    # Replace frontmatter in the original content
    updated_content = f"---\n{updated_frontmatter}\n---\n{post_content}"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"Updated {os.path.basename(file_path)}: {new_desc[:60]}...")

def main():
    blog_dir = "/Users/steipete/Projects/steipete-astro/src/content/blog"
    blog_files = glob.glob(f"{blog_dir}/*.md")
    
    for file_path in blog_files:
        process_file(file_path)
    
    print(f"Processed {len(blog_files)} blog posts")

if __name__ == "__main__":
    main()