// בעה"י

const APP_URL_FALLBACK = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, "")
}

export function buildPublicProfilePath(username: string) {
  return username ? `/${username}` : ""
}

export function buildPublicSnippetPath(username: string, snippetId: string) {
  if (!username || !snippetId) return ""
  return `/${username}/${snippetId}`
}

export function buildAbsolutePublicUrl(origin: string, path: string) {
  if (!origin || !path) return ""
  return `${normalizeOrigin(origin)}${path.startsWith("/") ? path : `/${path}`}`
}

export function getRequestOrigin(headerStore: Headers) {
  const forwardedProto = headerStore.get("x-forwarded-proto")
  const forwardedHost = headerStore.get("x-forwarded-host")
  const host = forwardedHost || headerStore.get("host")

  if (!host) return APP_URL_FALLBACK

  const proto = forwardedProto || (host.includes("localhost") || host.startsWith("127.") ? "http" : "https")
  return `${proto}://${host}`
}
