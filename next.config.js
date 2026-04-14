/** @type {import('next').NextConfig} */

// All specialty slugs served at the root level (e.g. /acupuncturist, /cardiologist)
// Add new slugs here when new specialty pages are created.
const SPECIALTY_SLUGS = [
  "family-doctor",
  "cardiologist",
  "dentist",
  "dermatologist",
  "orthopedist",
  "pediatrician",
  "psychiatrist",
  "ob-gyn",
  "ophthalmologist",
  "urgent-care",
  "neurologist",
  "medical-aesthetics",
  "chiropractor",
  "acupuncturist",
].join("|");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        // Matches /:slug only for known specialty slugs.
        // Static pages (login, signup, etc.) are matched first and are unaffected.
        source: `/:specialty(${SPECIALTY_SLUGS})`,
        destination: "/find-local-care/:specialty",
      },
    ];
  },
};

module.exports = nextConfig;
