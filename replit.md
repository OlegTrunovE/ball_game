# Meeting Breaker - Office Brick Breaker Game

## Overview

Meeting Breaker is a modern web-based brick breaker game with an office theme. Players control a paddle to bounce a ball and destroy meeting blocks representing different types of office meetings. The application is built using a modern full-stack architecture with React/TypeScript on the frontend and Express.js on the backend, featuring real-time canvas-based game mechanics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom styled components
- **Game Engine**: HTML5 Canvas with custom JavaScript game loop
- **State Management**: Zustand for client-side state (audio, game state)
- **3D Graphics**: Three.js with React Three Fiber (partially implemented)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES modules throughout the application
- **Development Server**: Vite middleware integration for hot reloading
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Session Management**: Basic in-memory storage with interface for database extension

### Build System
- **Bundler**: Vite for frontend, esbuild for backend production builds
- **TypeScript**: Shared configuration across client/server/shared modules
- **Asset Processing**: Support for GLSL shaders, 3D models (.gltf/.glb), and audio files

## Key Components

### Game Engine (`client/src/game/`)
- **Game.js**: Main game controller managing state, objects, and game loop
- **Ball.js**: Ball physics with trail effects and speed multipliers
- **Paddle.js**: Player-controlled paddle with smooth movement and visual effects
- **Meeting.js**: Meeting blocks with different types (normal, urgent, endless, deadline)
- **PowerUp.js**: Special effects system (coffee, auto-responder, etc.)
- **InputManager.js**: Cross-platform input handling (keyboard, mouse, touch)
- **SoundManager.js**: Audio system with mute controls and sound effects

### UI System
- **Game States**: Menu, instructions, game over screens with state management
- **Canvas Overlay**: HUD elements for score, lives, and active power-ups
- **Responsive Design**: Mobile-first approach with touch controls

### State Management
- **useGame**: Game phase management (ready/playing/ended)
- **useAudio**: Audio state and control functions
- **Local Storage**: User preferences and game settings persistence

### Backend Services
- **Storage Interface**: Abstracted storage layer supporting both memory and database backends
- **User Management**: Basic user schema with authentication structure
- **API Routes**: RESTful endpoint structure (currently minimal)

## Data Flow

### Game Loop
1. **Initialization**: Canvas setup, game object creation, event listener registration
2. **Update Cycle**: Physics calculations, collision detection, power-up effects
3. **Render Cycle**: Canvas clearing, object rendering, UI updates
4. **State Management**: Score tracking, level progression, game state transitions

### Input Processing
1. **Event Capture**: Keyboard, mouse, and touch events
2. **Input Normalization**: Cross-platform input standardization
3. **Game Action Mapping**: Input translation to game actions
4. **State Updates**: Game object position and state modifications

### Audio System
1. **Asset Loading**: Audio file initialization and preloading
2. **State Control**: Mute/unmute functionality with persistence
3. **Event Triggering**: Sound effects tied to game events
4. **Overlap Management**: Multiple sound instance handling

## External Dependencies

### Frontend Core
- **React Ecosystem**: React 18, React DOM, React Three Fiber for 3D graphics
- **TypeScript**: Type safety across the application
- **Vite**: Development server and build tooling
- **Tailwind CSS**: Utility-first styling framework

### UI Libraries
- **Radix UI**: Accessible component primitives (40+ components)
- **Lucide React**: Icon system
- **Class Variance Authority**: Component variant management

### Game Libraries
- **Three.js**: 3D graphics engine with React Three Fiber integration
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management (prepared for future API integration)

### Backend Core
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **tsx**: TypeScript execution for development

### Development Tools
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing with Autoprefixer
- **GLSL**: Shader support for advanced graphics

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite middleware integration with Express
- **Database**: Environment variable configuration for database URL
- **Asset Serving**: Static file serving with development middleware

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: ESBuild bundles server code with external dependencies
- **Database**: Drizzle migrations with PostgreSQL connection
- **Environment**: NODE_ENV-based configuration switching

### Architecture Decisions

**Canvas vs. React Components**: Chose HTML5 Canvas for game rendering to achieve smooth 60fps performance with complex animations and particle effects, while using React for UI overlays and state management.

**Zustand vs. Context**: Selected Zustand for game state management due to its minimal boilerplate and excellent performance for frequent updates during gameplay.

**Drizzle vs. Prisma**: Implemented Drizzle ORM for its lightweight nature and excellent TypeScript integration, though currently using in-memory storage with database interface prepared for future scaling.

**Vite vs. Webpack**: Chose Vite for its fast development server and optimized builds, particularly beneficial for the asset-heavy game environment with audio and potential 3D model support.

The application is designed for horizontal scaling with separation of concerns between game logic, state management, and potential backend services, making it suitable for future multiplayer features or cloud deployment.