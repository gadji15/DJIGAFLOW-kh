import { UnifiedHeader } from "./unified-header"

/**
 * LEGACY HEADER ALIAS
 *
 * This component provides backward compatibility for pages
 * that still import the old Header component.
 *
 * TODO: Replace all imports with UnifiedHeader and remove this file
 */
export function Header() {
  return <UnifiedHeader />
}

export default Header
