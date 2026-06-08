# ResponseNet Secure EOC Chat Prototype

This is a front-end prototype for an emergency operations chat system with role-based channels for EOC, LEO, Fire, EMS, State Patrol, state agencies, local agencies, and weather operations.

## How to open

Open `index.html` in a browser.

Demo access code: `EOC2026`

## Important

This is not production-ready and is not CJIS/HIPAA/NIMS-certified. For actual emergency response use, this would need a real backend, MFA, encryption, audit logging, retention policies, identity management, backups, and agency compliance review.

## Suggested next build steps

- Add a backend using Node.js + Socket.IO or Supabase Realtime.
- Add real authentication with MFA.
- Add encrypted message storage.
- Add audit logs and exportable incident timelines.
- Add GIS/radar panels for Weather.Exe integration.
- Add SITREP and resource request forms.
