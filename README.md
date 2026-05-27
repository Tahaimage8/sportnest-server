# SportNest Server

## Purpose

This is the backend server for the SportNest sports facility booking management system. It provides REST API endpoints for facilities, bookings, owner-specific facility management, search and filter, and protected API access using JWT verification.

## Live Links

- Server-side Live API: https://sportnest-server-psi.vercel.app/
- Client-side Live Website: https://sportnest-client-psi.vercel.app/
- Server-side GitHub Repository: https://github.com/Tahaimage8/sportnest-server
- Client-side GitHub Repository: https://github.com/Tahaimage8/sportnest-client

## Main Features

- Express.js REST API
- MongoDB database integration
- Facilities collection management
- Bookings collection management
- Add, read, update, and delete facilities
- Create and cancel bookings
- Get bookings by logged-in user
- Get facilities by owner email
- Search facilities by facility name using MongoDB `$regex`
- Filter facilities by sport type using MongoDB `$in`
- JWT verification middleware using Better Auth JWKS
- Protected APIs for booking and facility management
- Environment variable based secure configuration
- CORS enabled for client-server communication

## API Endpoints

### Public Endpoints

```txt
GET /
GET /facilities
GET /facilities?search=football
GET /facilities?type=Football Turf
GET /facilities?search=arena&type=Football Turf