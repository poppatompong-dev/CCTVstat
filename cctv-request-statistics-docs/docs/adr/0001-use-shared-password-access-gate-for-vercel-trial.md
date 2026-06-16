# Use shared password access gate for Vercel trial

For version 1, the system will be deployed on Vercel for trial use, which means the app has a public URL instead of being protected by an office LAN. We will add a lightweight shared-password access gate using an environment variable and a session cookie, rather than full user accounts or role management, because the project prioritizes fast internal use while still avoiding an unprotected public surface for request records and evidence attachments.

