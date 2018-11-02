

/**
 * 
 * @param plt 
 */
export function isMobile(plt: Platform): boolean {
  return !isTablet(plt) && plt.isPlatformMatch('mobile', ['AppleWebKit.*Mobile.*']);
}

/**
 * 是否为平板
 * @param plt 
 */
export function isTablet(plt: Platform): boolean {
  let smallest = Math.min(plt.getWidth(), plt.getHeight());
  let largest = Math.max(plt.getWidth(), plt.getHeight());
  const matchSize = (smallest > 460 && smallest < 1100) &&
    (largest > 780 && largest < 1400);

  const matchUa = plt.isMatch('ipad');
  return matchSize && matchUa;
}
