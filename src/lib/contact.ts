/**
 * The office address, in the form Google Maps geocodes it.
 *
 * Three places point at this pin: the Contact section's embedded map, its
 * "open in Maps" link, and the footer address. They have to resolve to the
 * same query string or they drop the visitor on three different pins, so the
 * address is written once here and the URLs are built from it.
 *
 * Deliberately not a translation string — the query is what Maps searches for,
 * not something the reader sees, and it must stay identical in every language.
 */
const OFFICE_QUERY = 'Ceyhun Atuf Kansu Cad. 1244. Sok. No:6/1 Çankaya Ankara'

/** For an <iframe>; `output=embed` is the only form Maps will frame. */
export const officeMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  OFFICE_QUERY,
)}&output=embed`

/** For a link. Opens the place in the Maps app on mobile, the site on desktop. */
export const officeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  OFFICE_QUERY,
)}`

/**
 * Phone and e-mail, split into what the reader sees and what the link does.
 *
 * The displayed number is the local Turkish form; the href has to be the full
 * international one, because a dialler is given the href, not the label.
 */
export const phoneDisplay = '(0312) 473 21 33'
export const phoneHref = 'tel:+903124732133'

export const emailAddress = 'cemvur@behainsaat.com'
export const emailHref = `mailto:${emailAddress}`
