# TopCars Valley - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TopCars Valley is a premium automotive community platform built with Next.js, TypeScript, and Tailwind CSS. It connects sports car enthusiasts through exclusive events, networking, and digital experiences.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Authentication**: NextAuth.js (planned)
- **Database**: Prisma + PostgreSQL (planned)

## Design System
### Colors
- **Racing Red**: #DC2626 (primary brand color)
- **Charcoal**: #262626 (dark backgrounds)
- **Graphite**: #404040 (medium tones)
- **Steel**: #525252 (light accents)

### Typography
- **Headlines**: Orbitron (font-orbitron)
- **Body Text**: Inter (font-inter)

### Components
- Use shadcn/ui components as base
- Follow racing/automotive aesthetic
- Maintain premium look and feel
- Ensure mobile responsivity

## Code Style Guidelines
1. Use TypeScript for all new files
2. Implement proper error handling
3. Follow Next.js 14 App Router patterns
4. Use server components by default, client components only when needed
5. Implement proper SEO meta tags
6. Ensure accessibility (WCAG 2.1)
7. Use semantic HTML structure

## Key Features to Implement
- **Authentication System**: Role-based access (Admin/Member)
- **Event Management**: Public and private events with RSVP
- **Member Dashboard**: Personalized experience
- **Communication System**: Internal messaging and announcements
- **WhatsApp Integration**: Customer support widget
- **Invitation System**: Exclusive token-based registration

## File Structure
- `/src/app`: Next.js App Router pages
- `/src/components`: Reusable UI components
- `/src/lib`: Utilities and configurations
- `/src/types`: TypeScript type definitions
- `/src/styles`: Global styles and theme configuration

## Brand Guidelines
- Maintain premium, exclusive feel
- Use automotive terminology and metaphors
- Emphasize community and networking aspects
- Keep content in Portuguese (Brazil)
- Focus on sports/luxury car culture
