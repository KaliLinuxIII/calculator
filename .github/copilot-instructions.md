# Calculator App - AI Coding Agent Instructions

## Project Overview

This is a multi-page web application disguised as a calculator with hidden puzzle mechanics. Users progress through 4 pages by discovering secret codes and completing challenges. The project uses vanilla HTML/CSS/JS with no build process.

## Architecture

**Page Flow & Purpose:**
- `startpage.html` - Calculator interface with easter egg code (1337) that unlocks page2
- `page2.html` - Password gate requiring "lavish1234" to proceed
- `page3.html` - Morse code input challenge using hold-duration detection
- `page4.html` - Success screen

**File Organization:**
- Each page follows `pageX.html`, `pageX.css`, `pageX.js` naming convention
- No shared utility files or modules - logic is self-contained per page
- Styling uses gradient backgrounds with neon/cyber aesthetic (#00ff88, #00ff00 glow effects)

## Critical Patterns

### State Management via localStorage
All progression state persists across page reloads using `localStorage`:
```javascript
// Example from page2.js
let failedAttempts = localStorage.getItem('failedAttempts') ? parseInt(localStorage.getItem('failedAttempts')) : 0;
localStorage.setItem('failedAttempts', failedAttempts);
```

**Key state variables:**
- `failedAttempts` - Tracks password failures on page2 (max 3, blocks access to page2 from calculator)
- `page3Attempts` - Tracks morse code failures on page3 (max 5, redirects to page2)

### Easter Eggs & Secret Codes

**Calculator (startpage.js):**
- Enter "1337" → triggers unlock to page2 (blocked if `failedAttempts >= 3`)
- Enter "121408" → instant access to page2
- Hold decimal button for 3s after calculation "121408^3" → resets failed attempts

**Page2 password gate:**
- Correct: `lavish1234`
- Admin reset: `resetattempts1234` (resets page3Attempts only)

**Page3 morse code:**
- Correct sequence: `- . . . . - . - - - - . - . - . -`
- Tap (< 600ms) = dot, Hold (≥ 600ms) = dash
- Hold "Return to Login" button for 3s → enters "Input Code" mode

### Hold-Duration Interaction Pattern

Used throughout for hidden features. Pattern:
```javascript
button.addEventListener('mousedown', () => {
  holdStartTime = Date.now();
  holdTimeout = setTimeout(() => {
    // Trigger action after 3s hold
  }, 3000);
});

button.addEventListener('mouseup', () => {
  const holdDuration = Date.now() - holdStartTime;
  if (holdDuration < 600) { /* tap */ } 
  else { /* hold */ }
});
```

### Display State & Visual Feedback

Calculator display (`startpage.js`) serves as feedback mechanism:
```javascript
display.value = 'UNLOCKING';
display.style.color = '#00ff88';
setTimeout(() => window.location.href = 'page2.html', 1500);
```

Pattern applies across all pages - status messages with color changes (#00ff00 = success, #ff0000 = error, #ffff00 = warning).

## Development Workflows

**Testing:** Open `startpage.html` directly in browser - no server required

**Debugging state:** Use browser DevTools → Application → localStorage to view/modify:
- `failedAttempts`
- `page3Attempts`

**Reset all progress:**
```javascript
localStorage.clear()
```

## Conventions

1. **No build tools** - Direct file editing, refresh browser to test
2. **Data attributes** - Buttons use `data-action` and `data-number` for event delegation
3. **Keyboard support** - Display is focusable; keydown events mirror button clicks
4. **Animations** - Use CSS animations with keyframes, not JS transitions
5. **Navigation** - Always use `window.location.href` for page changes (no SPA routing)

## Common Gotchas

- Calculator prevents display input except through buttons/keyboard - `keydown` uses `e.preventDefault()`
- Morse code requires 3s cooldown between inputs (see `isOnCooldown` flag)
- Page3 enter button uses `onclick` not `addEventListener` (legacy pattern)
- Failed attempts lock users out - must use reset codes to recover
- Hold detection breaks on `mouseleave` - clears timeout to prevent unintended triggers

## Adding New Features

When adding pages, follow the established pattern:
- Create `pageX.html`, `pageX.css`, `pageX.js` triplet
- Update navigation buttons on existing pages
- Add localStorage state if needed for progression tracking
- Use consistent color scheme (#1a1a2e dark bg, #00ff88 accent)
