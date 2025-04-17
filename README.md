# RuralGuru - Rural Property Booking Platform

RuralGuru is a comprehensive platform for booking rural properties, designed specifically for the Spanish market with features tailored to rural tourism.

## Features

- Property listings with detailed information and images
- User roles (Guest, Host, Admin) with different permissions
- Booking management system
- Check-in process with identity verification
- Reviews and ratings
- Messaging between hosts and guests
- Multi-language support (English and Spanish)
- Payment processing (Stripe and Redsys)
- Legal compliance for Spanish tourism regulations

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Database and Authentication)
- Vercel Blob (Image Storage)
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment and Blob storage)

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### Database Setup

1. Create a new Supabase project
2. Run the SQL script in `setup-database.sql` to create all necessary tables and relationships
3. Seed the database by visiting `/api/seed` in your browser after starting the development server

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/ruralguru.git
cd ruralguru

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Deployment

The application is designed to be deployed on Vercel:

\`\`\`bash
npm run build
vercel deploy
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
