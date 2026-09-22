import { useState, useEffect } from "react";

export type DeviceOS = "android" | "ios" | "windows" | "mac" | "linux" | "other";
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  os: DeviceOS;
  deviceType: DeviceType;
  deviceModel: string;
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPixel7a: boolean;
  screenWidth: number;
  screenHeight: number;
  viewportClass: string;
}

/**
 * Detects device model, operating system (Android, iOS, Desktop),
 * and live screen dimensions to cater the layout specifically to the user's screen.
 * Handles specific Android models like Google Pixel 7a, Galaxy, iPhones, and desktop browsers.
 */
export function detectDevice(): DeviceInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      os: "other",
      deviceType: "desktop",
      deviceModel: "Standard Browser",
      isAndroid: false,
      isIOS: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isPixel7a: false,
      screenWidth: 1280,
      screenHeight: 800,
      viewportClass: "viewport-desktop",
    };
  }

  const ua = navigator.userAgent || "";
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // OS Detection
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMac = /Macintosh|Mac OS X/i.test(ua) && !isIOS;
  const isWindows = /Windows NT/i.test(ua);
  const isLinux = /Linux/i.test(ua) && !isAndroid;

  let os: DeviceOS = "other";
  if (isAndroid) os = "android";
  else if (isIOS) os = "ios";
  else if (isMac) os = "mac";
  else if (isWindows) os = "windows";
  else if (isLinux) os = "linux";

  // Specific Model Parsing
  let deviceModel = "Desktop Web";
  let isPixel7a = false;

  if (isAndroid) {
    if (/Pixel 7a/i.test(ua)) {
      deviceModel = "Google Pixel 7a";
      isPixel7a = true;
    } else if (/Pixel/i.test(ua)) {
      const match = ua.match(/Pixel\s?([0-9a-zA-Z\s]+)/i);
      deviceModel = match ? `Google Pixel ${match[1].trim()}` : "Google Pixel";
      // Pixel 7a common CSS viewport width is ~412px
      if (screenWidth >= 390 && screenWidth <= 420) {
        isPixel7a = true;
      }
    } else if (/SM-[A-Za-z0-9]+/i.test(ua) || /Samsung/i.test(ua)) {
      deviceModel = "Samsung Galaxy";
    } else {
      // If width is in typical Pixel 7a range (412px viewport)
      if (screenWidth >= 400 && screenWidth <= 420) {
        deviceModel = "Google Pixel 7a";
        isPixel7a = true;
      } else {
        deviceModel = "Android Mobile";
      }
    }
  } else if (isIOS) {
    if (/iPad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      deviceModel = "Apple iPad";
    } else {
      deviceModel = "Apple iPhone";
    }
  } else {
    deviceModel = isMac ? "macOS Web" : isWindows ? "Windows PC" : "Web Desktop";
  }

  // Device Classification by Screen Width
  let deviceType: DeviceType = "desktop";
  if (screenWidth < 768 || (isAndroid && screenWidth < 800) || (isIOS && screenWidth < 800)) {
    deviceType = "mobile";
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    deviceType = "tablet";
  } else {
    deviceType = "desktop";
  }

  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";

  const viewportClass = isMobile
    ? isAndroid
      ? "device-android-mobile"
      : "device-ios-mobile"
    : isTablet
    ? "device-tablet"
    : "device-desktop";

  return {
    os,
    deviceType,
    deviceModel,
    isAndroid,
    isIOS,
    isMobile,
    isTablet,
    isDesktop,
    isPixel7a,
    screenWidth,
    screenHeight,
    viewportClass,
  };
}

/**
 * React hook to listen for window resize and orientation changes
 * and keep device & screen metrics updated in real-time.
 */
export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectDevice);

  useEffect(() => {
    function handleResize() {
      setDeviceInfo(detectDevice());
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return deviceInfo;
}
