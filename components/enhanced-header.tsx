import { UnifiedHeader } from "./unified-header"

/**
 * LEGACY ENHANCED HEADER ALIAS
 *
 * This component provides backward compatibility for pages
 * that still import the old EnhancedHeader component.
 *
 * TODO: Replace all imports with UnifiedHeader and remove this file
 */
export function EnhancedHeader() {
  return <UnifiedHeader />
}

export default EnhancedHeader
