#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

// Get all blog post files
const blogDir = path.join(process.cwd(), 'src/content/blog');
const blogFiles = globSync('**/*.{md,mdx}', { cwd: blogDir });

console.log(`Found ${blogFiles.length} blog posts. Fixing missing titles...`);

let fixedCount = 0;
let alreadyHadTitleCount = 0;
let errorCount = 0;

// Title mapping for files that need specific titles
const titleMapping = {
  'a-new-beginning.md': 'A New Beginning',
  'a-story-about-swizzling-the-right-way-and-touch-forwarding.md': 'A Story About Swizzling The Right Way and Touch Forwarding',
  'adding-keyboard-shortcuts-to-uialertview.md': 'Adding Keyboard Shortcuts to UIAlertView',
  'apple-silicon-mac-mini-for-ci.md': 'Apple Silicon Mac Mini for CI',
  'building-with-swift-trunk.md': 'Building with Swift Trunk',
  'couldnt-irgen-expression.md': "Couldn't IRGen Expression",
  'curating-your-twitter-timeline.md': 'Curating Your Twitter Timeline',
  'disabling-keyboard-avoidance-in-swiftui-uihostingcontroller.md': 'Disabling Keyboard Avoidance in SwiftUI UIHostingController',
  'dont-call-willchangevalueforkey.md': "Don't Call willChangeValueForKey:",
  'fixing-keyboardshortcut-in-swiftui.md': 'Fixing KeyboardShortcut in SwiftUI',
  'fixing-uisearchdisplaycontroller-on-ios-7.md': 'Fixing UISearchDisplayController on iOS 7',
  'fixing-uitextview-on-ios-7.md': 'Fixing UITextView on iOS 7',
  'fixing-what-apple-doesnt.md': "Fixing What Apple Doesn't",
  'forbidden-controls-in-catalyst-mac-idiom.md': 'Forbidden Controls in Catalyst Mac Idiom',
  'growing-your-twitter-followers.md': 'Growing Your Twitter Followers',
  'hacking-block-support-into-uimenuitem.md': 'Hacking Block Support into UIMenuItem',
  'hacking-with-aspects.md': 'Hacking with Aspects',
  'how-to-center-uiscrollview.md': 'How to Center UIScrollView',
  'how-to-inspect-the-view-hierarchy-of-3rd-party-apps.md': 'How to Inspect the View Hierarchy of 3rd Party Apps',
  'how-to-macos-core-dump.md': 'How to macOS Core Dump',
  'interposekit.md': 'InterposeKit',
  'jailbreaking-for-ios-developers.md': 'Jailbreaking for iOS Developers',
  'kernel-panic-surprise-boot-args.md': 'Kernel Panic Surprise Boot Args',
  'lets-try-this-again.md': "Let's Try This Again",
  'logging-in-swift.md': 'Logging in Swift',
  'mac-catalyst-crash-hunt.md': 'Mac Catalyst Crash Hunt',
  'moving-on.md': 'Moving On',
  'network-kernel-core-dump.md': 'Network Kernel Core Dump',
  'nsurlcache-uses-a-disk-cache-as-of-ios5.md': 'NSURLCache Uses a Disk Cache as of iOS 5',
  'pimping-recursivedescription.md': 'Pimping recursiveDescription',
  'reboot.md': 'Reboot',
  'researching-researchkit.md': 'Researching ResearchKit',
  'retrofitting-containsstring-on-ios-7.md': 'Retrofitting containsString on iOS 7',
  'rotation-multiple-windows-bug.md': 'Rotation Multiple Windows Bug',
  'smart-proxy-delegation.md': 'Smart Proxy Delegation',
  'supporting-both-tap-and-longpress-on-button-in-swiftui.md': 'Supporting Both Tap and LongPress on Button in SwiftUI',
  'the-lg-ultrafine5k-kerneltask-and-me.md': 'The LG UltraFine5K, kerneltask, and Me',
  'top-level-menu-visibility-in-swiftui.md': 'Top Level Menu Visibility in SwiftUI',
  'uiappearance-for-custom-views.md': 'UIAppearance for Custom Views',
  'uikit-debug-mode.md': 'UIKit Debug Mode',
  'uitableviewcontroller-designated-initializer-woes.md': 'UITableViewController Designated Initializer Woes',
  'updating-a-hackintosh.md': 'Updating a Hackintosh',
  'using-subscripting-with-Xcode-4_4-and-iOS-4_3.md': 'Using Subscripting with Xcode 4.4 and iOS 4.3',
  'zld-a-faster-linker.md': 'zld - A Faster Linker',
  'state-of-swiftui.md': 'State of SwiftUI',
  'calling-super-at-runtime.md': 'Calling Super at Runtime',
  'apple-silicon-m1-a-developer-perspective.md': 'Apple Silicon M1: A Developer Perspective'
};

// Fix each file
blogFiles.forEach((file) => {
  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { data, content } = matter(fileContent);
    
    // If it already has a title, skip
    if (data.title && data.title.trim() !== '') {
      alreadyHadTitleCount++;
      return;
    }
    
    // Get title from mapping or generate from filename
    let title;
    if (titleMapping[file]) {
      title = titleMapping[file];
    } else {
      // Generate title from filename
      title = file
        .replace(/\.mdx?$/, '')                // Remove file extension
        .replace(/^\d{4}-\d{2}-\d{2}-/, '')    // Remove date prefix if exists
        .split('-')                            // Split by hyphens
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(' ');                            // Join with spaces
    }
    
    // Update frontmatter with title
    const updatedFrontmatter = matter.stringify(content, {
      ...data,
      title: title
    });
    
    // Write updated content back to file
    fs.writeFileSync(filePath, updatedFrontmatter);
    console.log(`✅ Fixed title for: ${file} -> "${title}"`);
    fixedCount++;
    
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\nSummary:');
console.log(`✅ Posts fixed: ${fixedCount}`);
console.log(`⏭️ Posts already had titles: ${alreadyHadTitleCount}`);
console.log(`❌ Errors: ${errorCount}`);