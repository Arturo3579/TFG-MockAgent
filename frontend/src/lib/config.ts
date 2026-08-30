// Site-wide feature flags.
// These are intentionally constants (not env vars) so that turning a feature
// on/off is a visible code change in git history and requires a full rebuild.

export const ADS_ENABLED = false;
