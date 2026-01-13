# TestNauti.co - Brand Quick Reference Card

## 🎨 Color Palette

### Primary Colors
```css
--vibrant-blue: #00D4FF;    /* Main brand color */
--deep-navy: #002244;        /* Professional anchor */
--accent-teal: #20E2D8;      /* Secondary highlights */
--coral-accent: #FF6B6B;     /* Energetic highlights */
--sunny-orange: #FFB800;     /* Achievements */
```

### Supporting Colors
```css
--white: #FFFFFF;            /* Backgrounds */
--sky-light: #E0F7FA;        /* Soft sections */
--sky-medium: #B2EBF2;       /* Borders */
--sand-beige: #FFF3E0;       /* Warm touches */
```

---

## 🌊 Gradient Library

### Ocean Wave (Primary) - Most Used
```css
background: linear-gradient(135deg, #00D4FF 0%, #20E2D8 50%, #B2EBF2 100%);
```
Use for: Hero sections, primary buttons, key brand moments

### Sunset Burst (Accent)
```css
background: linear-gradient(135deg, #FF6B6B 0%, #FFB800 100%);
```
Use for: CTAs, achievements, energetic highlights

### Deep Ocean (Professional)
```css
background: linear-gradient(135deg, #002244 0%, #004488 100%);
```
Use for: Dark mode, premium sections

### Crystal Clear (NEW - Alternative)
```css
background: linear-gradient(135deg, #00D4FF 0%, #20E2D8 50%, #B2EBF2 100%);
```
Use for: High-energy sections (same as Ocean Wave, different name for variety)

---

## 📝 Typography

### Font Stack
```css
--font-heading: 'Poppins', sans-serif;      /* Bold, 800 weight */
--font-secondary: 'Quicksand', sans-serif;   /* Bold, 700 weight */
--font-body: 'Inter', sans-serif;            /* Regular, 400 weight */
```

### Size Scale
```css
--text-h1: 3.5rem;    /* 56px - Hero headlines */
--text-h2: 2.5rem;    /* 40px - Section headers */
--text-h3: 1.8rem;    /* 29px - Subsections */
--text-body: 1rem;    /* 16px - Body text */
--text-small: 0.875rem; /* 14px - Small text */
```

---

## 🎯 UI Component Specs

### Buttons
```css
padding: 18px 40px;
border-radius: 50px;
font: Quicksand Bold, 1rem;
box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
```
**Hover:** `transform: translateY(-3px) scale(1.05);`

### Cards
```css
padding: 30px;
border-radius: 20px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
border-top: 5px solid #00D4FF;
```
**Hover:** `transform: translateY(-8px);`

### Inputs
```css
padding: 15px 20px;
border: 2px solid #E0F7FA;
border-radius: 12px;
font: Inter Regular, 1rem;
```
**Focus:** `border-color: #00D4FF; box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);`

---

## 📐 Spacing Scale (8px base)

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

---

## 🔄 Border Radius Standards

- **Small elements (badges):** 8px
- **Form inputs:** 12px
- **Cards:** 15-20px
- **Large sections:** 25-30px
- **Buttons:** 50px (fully rounded)
- **Circular:** 50% or 999px

---

## ⚠️ DON'T USE

### ❌ Forbidden Gradients
- ~~`linear-gradient(#00D4FF, #FF6B6B)`~~ - Blue-to-Coral fusion
- Any gradient that transitions directly from blue to coral/orange

### ✅ Use Instead
- Ocean Wave gradient (blue → teal → light blue)
- Sunset gradient (coral → orange) separately
- Combine gradients in different sections, not within one gradient

---

## 🎨 CSS Variable Setup

```css
:root {
  /* Colors */
  --vibrant-blue: #00D4FF;
  --deep-navy: #002244;
  --accent-teal: #20E2D8;
  --coral-accent: #FF6B6B;
  --sunny-orange: #FFB800;
  --white: #FFFFFF;
  --sky-light: #E0F7FA;
  --sky-medium: #B2EBF2;
  --sand-beige: #FFF3E0;
  
  /* Gradients */
  --gradient-ocean: linear-gradient(135deg, #00D4FF 0%, #20E2D8 50%, #B2EBF2 100%);
  --gradient-sunset: linear-gradient(135deg, #FF6B6B 0%, #FFB800 100%);
  --gradient-deep: linear-gradient(135deg, #002244 0%, #004488 100%);
  
  /* Typography */
  --font-heading: 'Poppins', sans-serif;
  --font-secondary: 'Quicksand', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## 🚀 Quick Start Example

```html
<!-- Primary Button -->
<button style="
  background: linear-gradient(135deg, #00D4FF 0%, #20E2D8 50%, #B2EBF2 100%);
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
">
  Start Practice
</button>

<!-- Feature Card -->
<div style="
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #00D4FF;
">
  <h3 style="
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    color: #002244;
  ">Real Exam Questions</h3>
  <p style="
    font-family: 'Inter', sans-serif;
    color: #6B7280;
  ">Practice with authentic PER questions</p>
</div>
```

---

## 📱 View Full Resources

- **Style Guide:** http://localhost:8001/brand-style-guide.html
- **Website Mockups:** http://localhost:8001/website-mockups.html
- **Summary:** BRAND_UPDATE_SUMMARY.md

---

**TestNauti.co** - Bold, Vibrant, Marine-Inspired ⚓

