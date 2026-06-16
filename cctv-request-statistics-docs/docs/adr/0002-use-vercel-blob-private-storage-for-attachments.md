# Use Vercel Blob Private Storage for attachments

For the trial deployment, the app will run on Vercel without a persistent office server, so evidence attachments cannot rely on a local `uploads/` folder. We will store attachment files in Vercel Blob Private Storage and keep only metadata in Neon PostgreSQL, because this keeps the stack cloud-native, avoids public file URLs in the UI, and preserves the requirement that downloads go through the application access gate.

