# EduConnect

## Overview

EduConnect is a comprehensive educational platform that facilitates group-based learning through study groups, mentorships, materials sharing, and real-time messaging. The platform enables students and educators to create collaborative learning environments where they can organize mentorship sessions, share educational resources, and communicate effectively within structured groups.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side application is built using modern React with TypeScript, leveraging a component-based architecture with the following key decisions:

- **React + TypeScript**: Provides type safety and enhanced developer experience
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Router**: Lightweight client-side routing solution
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built accessible components
- **TanStack Query**: Powerful data fetching and caching solution for API interactions
- **React Hook Form + Zod**: Form handling with schema validation

The UI follows a design system approach using Radix UI primitives with consistent styling through CSS custom properties and Tailwind utilities.

### Backend Architecture

The server is built on Express.js with TypeScript, following a layered architecture pattern:

- **Express.js Framework**: RESTful API server with middleware-based request processing
- **Controller-Service-Storage Pattern**: Clear separation of concerns with controllers handling HTTP requests, services managing business logic, and storage layer abstracting database operations
- **JWT Authentication**: Stateless authentication using JSON Web Tokens with 2-hour expiration
- **Zod Validation**: Schema-based input validation for all API endpoints
- **Better SQLite3**: Embedded SQL database for development with foreign key constraints enabled

The API follows REST conventions with all endpoints prefixed with `/api` and implements proper error handling with consistent JSON responses.

### Data Storage Solutions

The application uses SQLite as the primary database with the following schema design:

- **Users Table**: Core user authentication and profile data
- **Groups Table**: Study group metadata with unique join codes
- **Group Members Table**: Many-to-many relationship between users and groups with role-based access
- **Mentorships Table**: Scheduled mentorship sessions within groups
- **Materials Table**: Educational resources shared within groups
- **Messages Table**: Group-based messaging system with pagination support

Foreign key relationships ensure data integrity, and the database is seeded with sample data in development environments.

### Authentication and Authorization

- **JWT-based Authentication**: Secure token-based authentication with configurable expiration
- **Role-based Access Control**: Group owners have additional permissions for management operations
- **Middleware Protection**: All non-public API routes require valid authentication tokens
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage

### Design Patterns and Architectural Decisions

- **Monorepo Structure**: Unified codebase with shared TypeScript schemas between client and server
- **Type-safe API Communication**: Shared type definitions ensure consistency between frontend and backend
- **Error Handling**: Global error middleware with development/production mode distinction
- **Development Tooling**: Hot reload in development with production-optimized builds
- **Security Middleware**: Helmet for security headers, CORS configuration, and rate limiting

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (prepared for production scaling)
- **express**: Web application framework
- **better-sqlite3**: SQLite database engine for development
- **drizzle-kit**: Database schema management and migrations

### Authentication & Security
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing and verification
- **helmet**: Security middleware for HTTP headers
- **cors**: Cross-origin resource sharing configuration

### Frontend UI Libraries
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **@tanstack/react-query**: Data fetching and state management
- **react-hook-form**: Form handling and validation
- **wouter**: Lightweight React router

### Validation & Type Safety
- **zod**: Schema validation library
- **typescript**: Static type checking
- **@types/***: Type definitions for JavaScript libraries

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution engine
- **@replit/***: Replit-specific development plugins