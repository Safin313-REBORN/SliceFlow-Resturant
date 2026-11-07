---
name: responsive-web-design
description: Guidelines and patterns for fluid, resilient, multi-device responsive web design adhering to mobile-first standards, container queries, and accessibility across all viewports.
---

# Responsive Web Design Skill

## Core Principles
1. **Mobile-First Foundation**: Design the base styles for compact viewports (360px - 390px) first, scaling up gracefully with `min-width` breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px).
2. **Fluid Typography & Spacing**: Avoid rigid pixel heights and fixed font sizes where flexbox or grid with `clamp()` or relative units provide elastic scaling.
3. **No Horizontal Overflow**: Elements must never cause unexpected horizontal scrollbars (`overflow-x: hidden` on viewport roots, `max-w-full`, and flexible flex/grid wrapping).
4. **Touch-Friendly Hit Targets**: Interactive controls must have minimum 44x44px touch targets on mobile viewports.
5. **Adaptive Layouts**:
   - Navigation: Hamburger/drawer or bottom sheet on mobile, persistent horizontal bar or sidebar on desktop.
   - Tables: Card-based or horizontally scrollable containers with sticky headers on smaller screens.
   - Pizza Customizer: Multi-step stepper navigation optimized for one-hand thumb interaction on mobile devices.

## Device Target Matrix
- **Mobile Compact**: 360px x 640px (Android basic)
- **Mobile Modern**: 390px x 844px (iPhone 12-15)
- **Tablet**: 768px x 1024px (iPad / Android Tablet)
- **Laptop**: 1024px x 768px / 1280px x 800px
- **Desktop**: 1440px+ (Standard monitors)

## Verification Checklist
- [ ] No horizontal scrolling at 360px, 390px, 768px, 1024px, 1440px.
- [ ] Navigation folds neatly into mobile drawer/toggle.
- [ ] Modal dialogs and drawers render within viewport bounds with backdrop blur and touch dismiss.
- [ ] Forms maintain clear field labels, helper text, and accessible error messages on all viewports.

