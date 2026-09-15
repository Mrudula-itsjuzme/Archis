# Pre-merge verification

Before merging this branch:

- [ ] sync latest `main` because the branch is currently behind by one commit
- [ ] `npm ci`
- [ ] `npm run build`
- [ ] run any repository tests/lint scripts
- [ ] open the demo and verify Intent → Protect/Incidental state
- [ ] verify Requested change → kitchen candidates renders without runtime errors
- [ ] hover/preview candidate updates both available views through the existing preview model path
- [ ] apply candidate and revert to architect draft
- [ ] verify hard-constraint messages remain correct
- [ ] remove/replace any remaining random or mock intent claims in the store before calling the impact layer deterministic end-to-end
- [ ] record a backup demo video

This branch adds real implementation, but the connector environment used to write it does not execute the React build. Do not merge on the assumption that a TypeScript compile has already passed.
