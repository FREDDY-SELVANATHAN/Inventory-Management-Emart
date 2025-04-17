# EMART Inventory Management System

A modern inventory management system for EMART grocery shop built with Next.js and MongoDB.

## Features

- Product management (add, view, update, delete)
- Category-based organization
- Real-time inventory tracking
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB installed and running locally
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd emart-inventory
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/emart-inventory
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/models/` - MongoDB models
- `src/lib/` - Utility functions and configurations
- `src/app/api/` - API routes

## Technologies Used

- Next.js 14
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- React Hot Toast
- Heroicons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
