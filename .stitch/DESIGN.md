# hiuzdoram Design System - "Neon Premium"

## 1. Aesthetic Vision
**Core Concept:** A highly dynamic, vibrant, and futuristic streaming platform interface. It combines deep space backgrounds with intense, glowing neon accents to create a visually arresting "wow" factor.
**Keywords:** Neon, Glowing, Glassmorphism, Cyberpunk-lite, Vibrant, Dynamic, Deep Space.
**Vibe:** Electric, engaging, complex but structured, high-energy.

## 2. Color Palette
- **Backgrounds:** Deep Space Black / Dark Navy (`#06060c` to `#0b0f19`). The void that makes the neon pop.
- **Surfaces:** Dark translucent glass (`rgba(15, 23, 42, 0.6)`) with subtle glowing borders.
- **Primary Accent (Neon Purple):** `#7c3aed` to `#a855f7`. Used for primary buttons, active states, and glowing hover effects.
- **Secondary Accent (Electric Blue):** `#3b82f6` to `#06b6d4`. Used for gradients and secondary highlights.
- **Tertiary Accent (Cyber Pink):** `#ec4899` to `#f43f5e`. Used for badges (like "YANGI" or Ratings) to provide sharp contrast.
- **Text:** Crisp white (`#ffffff`) for headlines, cool slate (`#94a3b8`) for secondary text.

## 3. Typography
- **Primary (Headlines):** `Inter` or `Space Grotesk`. Heavy font weights (700/800). Letter-spacing slightly tight for impact.
- **Secondary (Body):** `Inter`. Highly legible.
- **Monospace (Data/Numbers):** `JetBrains Mono` for episode numbers, times, and stats.

## 4. Visual Effects & Depth
- **Glassmorphism:** Widespread use of `backdrop-blur-md` on dark translucent backgrounds.
- **Neon Glows:** Elements (cards, buttons) should emit a soft glow matching their accent color, intensifying heavily on hover. Use multiple layered box-shadows (e.g., `box-shadow: 0 0 10px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.3)`).
- **Gradients:** Text and borders frequently use animated linear gradients (Purple -> Blue -> Pink).
- **Ambient Lighting:** Soft, large radial blurs placed absolutely in the background to provide a sense of atmospheric light.

## 5. Component Guidelines

### Buttons
- **Primary:** Solid neon purple background, bright white text. On hover, the background brightens and a strong purple outer glow activates.
- **Secondary:** Glass pill. Translucent background, glowing thin border. On hover, the border glow intensifies and the interior fills slightly.

### Cards (Dorama Posters)
- **Container:** Rounded corners (`1rem`). Deep surface with a subtle 1px border (`rgba(255,255,255,0.1)`).
- **Image:** Full coverage. On hover, the image scales up smoothly.
- **Interactivity:** On hover, the card's border transitions to a glowing neon color (Purple or Blue), and a matching drop shadow appears. An electric glowing "Play" button fades in at the center.
- **Badges:** Floating over the image. High-contrast neon pills (e.g., Pink for ratings).

### Navbar
- **Style:** Sticky glassmorphism header.
- **Logo:** The text `hiuzdoram` styled with a subtle neon text-shadow or gradient text fill.
- **Search:** A dark pill shape with a glowing border on focus.

### Layouts
- **Hero Section:** Expansive, edge-to-edge backdrop. Heavy gradient overlays fading to Deep Space Black at the bottom. Floating 3D elements or asymmetric floating cards for featured content. Large, impactful typography with glowing accents.
- **Content Grids:** Standard multi-column grids (4-6 columns on desktop), but spacing allows the glows of individual cards to breathe without overlapping harshly.

## 6. Motion & Animation
- **Hover States:** Immediate but smooth transitions (`duration-300`). 
- **Continuous:** Ambient orbs floating slowly in the background (`animate-pulse` or custom float).
- **Entrance:** Elements slide up and fade in with a slight spring effect upon page load.
