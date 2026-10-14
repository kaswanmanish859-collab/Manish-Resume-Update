import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResumePilot AI — AI-Powered Resume Updater & ATS Tailoring',
  description:
    'Automatically update and tailor existing resumes to match any Job Description using Google Gemini AI. Preserves factual qualifications, provides ATS match scoring, and exports professional PDFs.',
  keywords: ['Resume Tailoring', 'AI Resume Updater', 'ATS Optimizer', 'Google Gemini', 'PDF Resume Generator'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
