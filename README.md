# Sportingbet AI Platform

Sportingbet is an AI-powered sports betting platform that provides users with insightful analysis, betting tips, and odds for various sports events. This project is built using Next.js, React, and Tailwind CSS, and leverages a variety of modern UI components to deliver a seamless user experience.

## Features

- **AI-Powered Analysis**: Get in-depth analysis and betting tips for sports events
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI
- **Dynamic Content**: Uses Next.js App Router for server-side rendering and dynamic content delivery
- **Interactive Components**: Includes interactive components like carousels, tabs, and more
- **Dark Mode Support**: Toggle between light and dark themes
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Form Handling**: Advanced form validation with React Hook Form and Zod

## Tech Stack

- **Next.js 14**: The latest version of the React framework for server-side rendering and static site generation
- **React 18**: A JavaScript library for building user interfaces
- **TypeScript 5.3**: Type-safe JavaScript for better developer experience
- **Tailwind CSS 3.4**: A utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality React components built with Radix UI and Tailwind CSS
- **Radix UI**: Accessible UI primitives for React
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library for React
- **Zustand**: State management solution
- **React Hook Form**: Form handling with validation
- **Zod**: TypeScript-first schema validation
- **Recharts**: Charting library for React

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sportingbet.git
   cd sportingbet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **`app/`**: Main application directory with pages and layouts using the Next.js App Router
- **`components/`**: Contains reusable UI components built with shadcn/ui
- **`data/`**: JSON files for static data used in the application
- **`lib/`**: Utility functions and helpers
- **`hooks/`**: Custom React hooks
- **`public/`**: Static assets and images

## Configuration

- **Next.js Configuration**: Located in `next.config.js`
- **Tailwind CSS**: Configured in `tailwind.config.ts` and `app/globals.css`
- **TypeScript**: Configured in `tsconfig.json`
- **ESLint**: Configured in `.eslintrc.json` for code quality and consistency
- **shadcn/ui**: Component configuration in `components.json`

## Development Guidelines

- Use the "use client" directive for components that utilize client-side hooks
- Follow the design guidelines for creating beautiful and production-worthy pages
- Use Lucide React for icons
- Implement proper TypeScript types for all components and functions
- Follow the component structure and naming conventions

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact the project maintainers.

## Docker Setup

### Prerequisites
- Docker installed on your machine
- Docker daemon running

### Building the Application
To build the Docker image:
```bash
docker build -t sportingbet-cwc .
```

### Running the Application
To run the container:
```bash
docker run -p 3000:3000 sportingbet-cwc
```

The application will be available at `http://localhost:3000`

### Development Mode
For development with hot-reload, you can mount your local directory:
```bash
docker run -p 3000:3000 -v $(pwd):/usr/src/app sportingbet-cwc npm run dev
```

### Docker Commands Reference
- Stop the container: `docker stop sportingbet-cwc`
- Remove the container: `docker rm sportingbet-cwc`
- List running containers: `docker ps`
- View container logs: `docker logs sportingbet-cwc`